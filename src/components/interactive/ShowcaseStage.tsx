"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { ZoomSettledContext } from "./LaptopZoom";
import { LivePreview } from "./LivePreview";

type Item = Pick<Project, "slug" | "name" | "sector" | "host" | "url" | "desktop" | "walkthrough">;

const INTERVAL = 6000;

/**
 * The laptop's base, drawn from directly above: keyboard and trackpad on a brushed
 * aluminium deck. CSS hinges it back from the lid in 3D, so the keyboard keeps its
 * real shape and perspective whichever way the laptop turns. Purely decorative.
 */
const KEY_ROWS = [14, 14, 14, 13, 12].map((count, row) => {
  const y = 46 + row * 52;
  const inset = 70;
  const gap = 10;
  const key = (1000 - inset * 2 - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => ({
    x: inset + i * (key + gap),
    y,
    w: key,
  }));
});

function LaptopBase() {
  return (
    <svg
      className="laptop__base"
      viewBox="0 0 1000 640"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bdbab5" />
          <stop offset="1" stopColor="#d9d6d1" />
        </linearGradient>
      </defs>
      <rect width="1000" height="640" rx="28" fill="url(#deck)" />
      <rect x="0" y="0" width="1000" height="10" fill="#a8a49f" />
      {KEY_ROWS.flat().map((k) => (
        <rect key={`${k.x}-${k.y}`} x={k.x} y={k.y} width={k.w} height={42} rx={6} fill="#2b2a28" />
      ))}
      <rect x="330" y="346" width="340" height="230" rx="16" fill="#cbc8c3" stroke="#aeaaa5" strokeWidth="2" />
      <rect x="0" y="626" width="1000" height="14" rx="7" fill="#9c9893" />
    </svg>
  );
}

/**
 * The homepage showcase: our real projects on a laptop, cross-fading between them.
 * Tabs, swipe (touch) and an autoplay that pauses on hover, focus, or on request.
 */
export function ShowcaseStage({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(0);
  // Tapping the screen opens a live look at the site: a cursor browsing the real page.
  const [live, setLive] = useState(false);

  const go = useCallback((i: number) => setIndex((i + items.length) % items.length), [items.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Holds still while the hero zoom is carrying it onto the screen, so projects never cross-fade mid-move.
  const zoomSettled = useContext(ZoomSettledContext);
  const playing = !reduced && !userPaused && !hovered && zoomSettled && !live;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [playing, index, go]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
      swiped.current = Date.now();
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  const current = items[index];

  return (
    <div
      className="showcase"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        className="laptop showcase__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Recent work"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <div className="laptop__view">
          <div className="laptop__body">
            <div className="laptop__screen">
              <div className="laptop__display showcase__frames">
                {items.map((p, i) => (
                  <Image
                    key={p.slug}
                    src={p.desktop}
                    alt={i === index ? `The ${p.name} website on a laptop` : ""}
                    aria-hidden={i !== index}
                    sizes="(min-width: 64rem) 900px, 100vw"
                    preload={i === 0}
                    className={`showcase__img${i === index ? " is-active" : ""}`}
                  />
                ))}
                {live && (
                  <LivePreview
                    key={current.slug}
                    {...current.walkthrough}
                    name={current.name}
                  />
                )}
                <span className="laptop__hint" aria-hidden="true" hidden={live}>
                  <span className="on-touch">Tap</span>
                  <span className="on-hover">Click</span> to explore
                </span>
              </div>
              {/* Covers the screen, so a tap anywhere on it starts or stops the live preview. */}
              <button
                type="button"
                className="laptop__hit"
                aria-pressed={live}
                aria-label={live ? `Stop the ${current.name} preview` : `Preview the ${current.name} website in action`}
                onClick={() => {
                  if (Date.now() - swiped.current > 400) setLive((v) => !v);
                }}
              />
            </div>
            <LaptopBase />
          </div>
        </div>
      </div>

      <div className="showcase__bar">
        <div className="showcase__tabs" aria-label="Choose a project" role="group">
          {items.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-pressed={i === index}
              className="showcase__tab"
              onClick={() => go(i)}
            >
              <span className="showcase__tab-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="showcase__tab-name">{p.name}</span>
              <span className="showcase__progress" aria-hidden="true">
                {i === index && (
                  <span
                    key={`${index}-${playing}`}
                    style={{
                      animationDuration: `${INTERVAL}ms`,
                      animationPlayState: playing ? "running" : "paused",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="showcase__meta">
          <p className="showcase__caption" aria-live="polite">
            {current.sector}
          </p>
          <Link href={`/work#${current.slug}`} className="showcase__link">
            View project
          </Link>
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="showcase__link"
            aria-label={`View the ${current.name} website live (opens in a new tab)`}
          >
            View live ↗
          </a>
          {!reduced && (
            <button
              type="button"
              className="showcase__pause"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {userPaused ? (
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
                  <path d="M0 0l10 6-10 6z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
                  <path d="M0 0h3v12H0zM7 0h3v12H7z" fill="currentColor" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
