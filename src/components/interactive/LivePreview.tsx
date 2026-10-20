"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

/** Page captures are 800px wide; positions below are in that page's pixels. */
const PAGE_W = 800;
/** The laptop display is 16:10, so it shows this much of the page at once. */
const VIEW_H = PAGE_W / 1.6;

type Step = ["wait", number] | ["move", number, number, number] | ["click"] | ["scroll", number, number];

/**
 * A short visit to each site: the cursor heads for real buttons and links on the capture,
 * clicks them, and scrolls on to the section they lead to. Each move targets a point
 * that is on screen at that scroll position.
 */
const SCRIPTS: Record<string, Step[]> = {
  "ev-exec": [
    ["wait", 700],
    ["move", 96, 273, 900], // Book Your Transfer
    ["click"],
    ["scroll", 380, 1100],
    ["move", 271, 529, 800], // To the Airport
    ["click"],
    ["wait", 400],
    ["move", 330, 620, 600],
    ["scroll", 760, 1400], // Our Services
    ["wait", 500],
    ["scroll", 1240, 1400], // Reviews
    ["move", 400, 1330, 700],
    ["wait", 500],
    ["scroll", 1548, 1000],
    ["move", 380, 1714, 800], // Book Your Transfer
    ["click"],
    ["wait", 700],
    ["scroll", 0, 1700],
    ["wait", 900],
  ],
  boonma: [
    ["wait", 700],
    ["move", 292, 25, 900], // Treatments
    ["click"],
    ["scroll", 660, 1300], // Choose Your Treatment
    ["wait", 400],
    ["scroll", 960, 900],
    ["move", 148, 1056, 800], // Book
    ["click"],
    ["wait", 400],
    ["move", 246, 1056, 500], // Details
    ["click"],
    ["scroll", 1700, 1500], // Pricing
    ["wait", 600],
    ["scroll", 2250, 1200], // Our story
    ["move", 135, 2535, 900], // Book Your Treatment
    ["click"],
    ["wait", 700],
    ["scroll", 0, 1900],
    ["wait", 900],
  ],
  fystay: [
    ["wait", 700],
    ["move", 180, 330, 900], // Where
    ["click"],
    ["wait", 400],
    ["move", 668, 328, 700], // Search
    ["click"],
    ["scroll", 380, 1200], // Stays worth the trip
    ["move", 185, 520, 700],
    ["wait", 500],
    ["scroll", 880, 1200],
    ["move", 190, 985, 700], // Blackpool
    ["click"],
    ["scroll", 1233, 1000],
    ["move", 132, 1332, 700], // See transfers
    ["click"],
    ["wait", 700],
    ["scroll", 0, 1500],
    ["wait", 900],
  ],
  "alex-k-bells": [
    ["wait", 700],
    ["move", 533, 21, 900], // How to book
    ["click"],
    ["scroll", 880, 1400], // Choose how you train
    ["wait", 400],
    ["scroll", 1080, 700],
    ["move", 134, 1397, 800], // Request a class
    ["click"],
    ["wait", 500],
    ["scroll", 2200, 1600], // Where and how to book
    ["move", 172, 2545, 900], // Start your training
    ["click"],
    ["wait", 500],
    ["scroll", 2700, 1000], // Questions
    ["move", 718, 2808, 800],
    ["click"],
    ["wait", 700],
    ["scroll", 0, 2000],
    ["wait", 900],
  ],
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type Track = { t0: number; t1: number; from: number[]; to: number[] };

/** Turns a script into tracks for the cursor (in view units) and the scroll, plus click times. */
function compile(steps: Step[], pageH: number) {
  const maxScroll = Math.max(0, pageH - VIEW_H);
  let t = 0;
  let cursor = [PAGE_W * 0.62, VIEW_H * 0.58];
  let scroll = 0;
  const moves: Track[] = [];
  const scrolls: Track[] = [];
  const clicks: number[] = [];
  for (const step of steps) {
    if (step[0] === "wait") t += step[1];
    else if (step[0] === "click") {
      clicks.push(t);
      t += 420;
    } else if (step[0] === "move") {
      const to = [step[1], step[2] - scroll];
      moves.push({ t0: t, t1: t + step[3], from: cursor, to });
      cursor = to;
      t += step[3];
    } else {
      const to = Math.min(maxScroll, step[1]);
      scrolls.push({ t0: t, t1: t + step[2], from: [scroll], to: [to] });
      scroll = to;
      t += step[2];
    }
  }
  return { moves, scrolls, clicks, total: t, start: [PAGE_W * 0.62, VIEW_H * 0.58] };
}

function at(tracks: Track[], t: number, initial: number[]) {
  let value = initial;
  for (const k of tracks) {
    if (t >= k.t1) value = k.to;
    else if (t > k.t0) {
      const u = ease((t - k.t0) / (k.t1 - k.t0));
      return k.from.map((f, i) => f + (k.to[i] - f) * u);
    } else break;
  }
  return value;
}

/**
 * A live look inside the laptop: the project's full page in the display, with a cursor
 * browsing it (moving to real buttons, clicking, scrolling between sections) on a loop.
 * The page starts exactly where the screenshot does, so switching in is seamless. With
 * reduced motion there is no cursor; the page simply scrolls under the visitor's finger.
 */
export function LivePreview({ slug, page, name }: { slug: string; page: StaticImageData; name: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  // Only ever mounted after a tap, so the browser setting can be read straight away.
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const root = rootRef.current;
    const pageEl = pageRef.current;
    const cursor = cursorRef.current;
    const ripple = rippleRef.current;
    const script = SCRIPTS[slug];
    if (reduced || !root || !pageEl || !cursor || !ripple || !script) return;

    const pageH = (page.height / page.width) * PAGE_W;
    const { moves, scrolls, clicks, total, start } = compile(script, pageH);
    let frame = 0;
    let begun = 0;
    let lastT = -1;
    let visible = true;

    const draw = (now: number) => {
      frame = 0;
      if (!begun) begun = now;
      const t = (now - begun) % total;
      // A loop restarted: let the click check run from the top again.
      if (t < lastT) lastT = -1;
      const unit = root.clientWidth / PAGE_W; // screen px per page px
      const [scroll] = at(scrolls, t, [0]);
      const [cx, cy] = at(moves, t, start);
      pageEl.style.transform = `translate3d(0, ${(-scroll * unit).toFixed(2)}px, 0)`;
      cursor.style.transform = `translate3d(${(cx * unit).toFixed(1)}px, ${(cy * unit).toFixed(1)}px, 0)`;
      const click = clicks.find((c) => c > lastT && c <= t);
      if (click !== undefined) {
        ripple.style.transform = cursor.style.transform;
        ripple.classList.remove("is-on");
        cursor.classList.remove("is-pressed");
        void ripple.offsetWidth; // restart the animations
        ripple.classList.add("is-on");
        cursor.classList.add("is-pressed");
      }
      lastT = t;
      if (visible) frame = requestAnimationFrame(draw);
    };

    // Only animate while the laptop is on screen and the tab is visible.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    io.observe(root);
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [slug, page, reduced]);

  return (
    <div ref={rootRef} className={`live${reduced ? " live--manual" : ""}`}>
      <div ref={pageRef} className="live__page">
        <Image src={page} alt={`The ${name} website, being browsed`} sizes="(min-width: 64rem) 900px, 100vw" placeholder="blur" />
      </div>
      {!reduced && (
        <>
          <span ref={rippleRef} className="live__ripple" aria-hidden="true" />
          <span ref={cursorRef} className="live__cursor" aria-hidden="true">
            <svg viewBox="0 0 16 22" width="16" height="22" focusable="false">
              <path d="M1 1v17.5l4.6-4.3 2.9 6.6 2.9-1.3-2.9-6.4H15z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
        </>
      )}
    </div>
  );
}
