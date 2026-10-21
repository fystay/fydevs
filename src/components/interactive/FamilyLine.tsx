"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const LEAD = "Every site here runs a family business. ";
const LAST = "Ours.";
const FULL = LEAD + LAST;
// The line is fully typed this far through the pinned scroll (a short swipe or two), so it
// rarely sits half-typed; the rest is a hold on it.
const DONE_AT = 0.45;
// On a fast scroll the letters catch up at this many per frame, so they arrive evenly.
const MAX_STEP = 2;

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
    let current = 0;
    // How many letters the scroll position calls for: from the section's top reaching
    // near the top of the screen (the line is then close to centre, so no stray fragment shows
    // low on the screen) to most of the way through the pin.
    const target = () => {
      const r = el.getBoundingClientRect();
      const lead = window.innerHeight * 0.15;
      const run = r.height - window.innerHeight + lead;
      const p = run > 0 ? Math.min(1, Math.max(0, (lead - r.top) / run)) : 1;
      return Math.round((Math.min(p, DONE_AT) / DONE_AT) * FULL.length);
    };
    // Step towards the target a few letters a frame, until it's reached.
    const update = () => {
      frame = 0;
      const goal = target();
      current += Math.max(-MAX_STEP, Math.min(MAX_STEP, goal - current));
      setShown(current);
      if (current !== goal) frame = requestAnimationFrame(update);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    current = target();
    setShown(current);
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
  // No caret blinking on an empty line: it arrives with the first letter.
  const caret = count > 0 ? <span key="caret" className="family-line__caret" data-typing={typing || undefined} /> : null;
  // The caret sits right after the last typed letter, ahead of the hidden ones.
  const letters = (text: string, offset: number) =>
    [...text].flatMap((ch, i) => {
      const letter = (
        <span key={i} className={offset + i < count ? undefined : "family-line__hidden"}>
          {ch}
        </span>
      );
      return offset + i === count && caret ? [caret, letter] : [letter];
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
