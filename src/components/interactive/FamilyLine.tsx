"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const LEAD = "Every site here runs a family business. ";
const LAST = "Ours.";
const FULL = LEAD + LAST;
// The line is fully typed this far through the pinned scroll; the rest is a short hold on it.
const DONE_AT = 0.8;

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * One true line, full screen. The section is taller than the screen and its line pins
 * in place while the visitor scrolls through it, typing out in step with the scroll,
 * so it plays at their pace and only while it's in front of them. Every letter is laid
 * out from the start (hidden until typed), so nothing moves; screen readers get the
 * whole sentence at once, and reduced motion shows it without pinning.
 */
export function FamilyLine() {
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // From the section's top reaching mid-screen (so the first words appear as it
      // arrives) to the end of the pinned run.
      const r = el.getBoundingClientRect();
      const lead = window.innerHeight / 2;
      const run = r.height - window.innerHeight + lead;
      const p = run > 0 ? Math.min(1, Math.max(0, (lead - r.top) / run)) : 1;
      setShown(Math.round((Math.min(p, DONE_AT) / DONE_AT) * FULL.length));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
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
    <section ref={ref} className="family-line" data-pinned={!reduced || undefined} data-cta-hide>
      <div className="family-line__stage">
        <p className="visually-hidden">{FULL}</p>
        <p className="container container--wide family-line__text" aria-hidden="true">
          {letters(LEAD, 0)}
          <em>
            {letters(LAST, LEAD.length)}
            {!typing && caret}
          </em>
        </p>
      </div>
    </section>
  );
}
