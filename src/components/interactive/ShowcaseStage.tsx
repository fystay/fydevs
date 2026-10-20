"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import devices from "../Devices.module.css";
import { ZoomSettledContext } from "./LaptopZoom";

type Item = Pick<Project, "slug" | "name" | "sector" | "host" | "url" | "desktop" | "mobile">;

const INTERVAL = 6000;

/**
 * The homepage showcase: real project screenshots that cross-fade between projects.
 * Tabs, swipe (touch) and an autoplay that pauses on hover, focus, or on request.
 * The layers drift slightly with the cursor on devices with a fine pointer.
 */
export function ShowcaseStage({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
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

  const onPointerMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el || e.pointerType !== "mouse" || reduced) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

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
      onMouseLeave={() => {
        setHovered(false);
        stageRef.current?.style.setProperty("--px", "0");
        stageRef.current?.style.setProperty("--py", "0");
      }}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        ref={stageRef}
        className="stage showcase__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Recent work"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <figure className={`${devices.browser} stage__browser showcase__layer showcase__layer--back`}>
          <div className={`${devices.bar} stage__bar`} aria-hidden="true">
            <span className={`${devices.dots} stage__dots`}>
              <i />
              <i />
              <i />
            </span>
            <span className={`${devices.url} stage__url`}>{current.host}</span>
          </div>
          <div className="showcase__frames">
            {items.map((p, i) => (
              <Image
                key={p.slug}
                src={p.desktop}
                alt={i === index ? `The ${p.name} website on desktop` : ""}
                aria-hidden={i !== index}
                sizes="(min-width: 80rem) 1000px, 100vw"
                preload={i === 0}
                className={`showcase__img${i === index ? " is-active" : ""}`}
              />
            ))}
          </div>
        </figure>
        <figure className={`${devices.phone} stage__phone showcase__layer showcase__layer--front`}>
          <div className="showcase__frames">
            {items.map((p, i) => (
              <Image
                key={p.slug}
                src={p.mobile}
                alt={i === index ? `The ${p.name} website on a phone` : ""}
                aria-hidden={i !== index}
                sizes="220px"
                className={`${devices.screen} showcase__img${i === index ? " is-active" : ""}`}
              />
            ))}
          </div>
        </figure>
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
