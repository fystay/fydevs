"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { ZoomSettledContext } from "./LaptopZoom";

type Item = Pick<Project, "slug" | "name" | "sector" | "host" | "url" | "desktop">;

const INTERVAL = 6000;

/**
 * The laptop's keyboard deck, seen from just above: key rows narrow towards the
 * hinge, with a trackpad below. Drawn once; purely decorative.
 */
const KEY_ROWS = [14, 14, 13, 12, 11].map((count, row) => {
  const y = 8 + row * 12;
  const inset = 88 - row * 7; // rows widen towards the front edge
  const width = 1000 - inset * 2;
  const gap = 4;
  const key = (width - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => ({ x: inset + i * (key + gap), y, w: key }));
});

function KeyboardDeck() {
  return (
    <svg className="laptop__base" viewBox="0 0 1000 128" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9b6b1" />
          <stop offset="1" stopColor="#d6d3ce" />
        </linearGradient>
      </defs>
      <path d="M58 0H942L1000 112H0Z" fill="url(#deck)" />
      <path d="M0 112H1000V118Q1000 126 988 126H12Q0 126 0 118Z" fill="#9c9893" />
      <path d="M440 112H560V115Q560 118 556 118H444Q440 118 440 115Z" fill="#86827d" />
      {KEY_ROWS.flat().map((k) => (
        <rect key={`${k.x}-${k.y}`} x={k.x} y={k.y} width={k.w} height={9.5} rx={1.8} fill="#2b2a28" />
      ))}
      <rect x="410" y="71" width="180" height="34" rx="4" fill="#c9c6c1" stroke="#aeaaa5" strokeWidth="1" />
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
  const playing = !reduced && !userPaused && !hovered && zoomSettled;

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
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - start.y)) go(index + (dx < 0 ? 1 : -1));
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
          </div>
        </div>
        <KeyboardDeck />
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
                    style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: playing ? "running" : "paused" }}
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
