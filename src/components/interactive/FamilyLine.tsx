"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const LEAD = "Every site here runs a family business. ";
const LAST = "Ours.";
const FULL = LEAD + LAST;
const TYPE_MS = 42; // per character
const PAUSE_MS = 650; // before "Ours."

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * One true line, full screen, typed out when it scrolls into view. Every letter is laid
 * out from the start (hidden until typed), so the page never shifts as it types; screen
 * readers get the whole sentence at once.
 */
export function FamilyLine() {
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const step = (n: number) => {
          setShown(n);
          if (n >= FULL.length) return;
          timer = window.setTimeout(() => step(n + 1), n === LEAD.length ? PAUSE_MS : TYPE_MS);
        };
        step(1);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduced]);

  const count = reduced ? FULL.length : shown;
  const typing = count < FULL.length;
  const caret = <span key="caret" className="family-line__caret" data-typing={typing || undefined} />;
  // The caret sits right after the last typed letter, ahead of the hidden ones.
  const letters = (text: string, offset: number) =>
    [...text].flatMap((ch, i) => {
      const letter = (
        <span key={i} className={offset + i < count ? undefined : "family-line__hidden"}>
          {ch}
        </span>
      );
      return offset + i === count ? [caret, letter] : [letter];
    });

  return (
    <section className="family-line" data-cta-hide>
      <p className="visually-hidden">{FULL}</p>
      <p ref={ref} className="container container--wide family-line__text" aria-hidden="true">
        {letters(LEAD, 0)}
        <em>
          {letters(LAST, LEAD.length)}
          {!typing && caret}
        </em>
      </p>
    </section>
  );
}
