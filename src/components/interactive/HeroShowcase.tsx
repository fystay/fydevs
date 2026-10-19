"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { ArrowUpRight } from "../Icons";

type Item = Pick<Project, "slug" | "name" | "sector" | "host" | "url" | "desktop" | "embeddable">;

type Software = { name: string; category: string; url: string; host: string; image: StaticImageData; alt: string };

const INTERVAL = 6000;

function Bar({ host }: { host: string }) {
  return (
    <div className="hs-card__bar" aria-hidden="true">
      <span className="hs-card__dots">
        <i />
        <i />
        <i />
      </span>
      <span className="hs-card__url">{host}</span>
    </div>
  );
}

function LiveLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hs-card__live"
      aria-label={`View ${name} live (opens in a new tab)`}
    >
      <span className="hs-card__live-text">View live</span>
      <ArrowUpRight size={12} />
    </a>
  );
}

/**
 * The homepage hero composition: three layered previews of real work.
 * The large and overlapping cards rotate through the projects every six seconds;
 * the third shows the booking software. Rotation pauses on hover, focus, a live
 * preview or on request, and never runs with reduced motion. Previews are
 * screenshots; a project whose site permits framing can be loaded live on request.
 */
export function HeroShowcase({ items, software }: { items: Item[]; software: Software }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [live, setLive] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (i: number) => {
      setLive(null);
      setIndex((i + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const playing = !reduced && !userPaused && !hovered && live === null;

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
    if (!start || live) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - start.y)) go(index + (dx < 0 ? 1 : -1));
  };

  const current = items[index];
  const next = items[(index + 1) % items.length];

  return (
    <div
      className="hs"
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
        className="hs__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <article className="hs-card hs-card--main" aria-label={`${current.name}, ${current.sector}`}>
          <Bar host={current.host} />
          <div className="hs-card__frames">
            {items.map((p, i) => (
              <Image
                key={p.slug}
                src={p.desktop}
                alt={i === index ? `The ${p.name} website` : ""}
                aria-hidden={i !== index}
                sizes="(min-width: 64rem) 640px, 86vw"
                preload={i === 0}
                className={i === index ? "is-active" : undefined}
              />
            ))}
            {live === current.slug && (
              <iframe
                src={current.url}
                title={`Live preview of the ${current.name} website`}
                className="hs-card__iframe"
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            )}
          </div>
          <div className="hs-card__label">
            <div>
              <p className="hs-card__name">{current.name}</p>
              <p className="hs-card__cat">{current.sector}</p>
            </div>
            <div className="hs-card__actions">
              {current.embeddable && (
                <button
                  type="button"
                  className="hs-card__try"
                  aria-pressed={live === current.slug}
                  onClick={() => setLive((v) => (v === current.slug ? null : current.slug))}
                >
                  {live === current.slug ? "Show screenshot" : "Try it live"}
                </button>
              )}
              <LiveLink href={current.url} name={current.name} />
            </div>
          </div>
        </article>

        <article className="hs-card hs-card--side" aria-label={`${next.name}, ${next.sector}`}>
          <Bar host={next.host} />
          <div className="hs-card__frames">
            {items.map((p, i) => (
              <Image
                key={p.slug}
                src={p.desktop}
                alt={p.slug === next.slug ? `The ${p.name} website` : ""}
                aria-hidden={p.slug !== next.slug}
                sizes="(min-width: 64rem) 340px, 48vw"
                preload={i === 1}
                className={p.slug === next.slug ? "is-active" : undefined}
              />
            ))}
          </div>
          <div className="hs-card__label">
            <div>
              <p className="hs-card__name">{next.name}</p>
              <p className="hs-card__cat">{next.sector}</p>
            </div>
            <LiveLink href={next.url} name={next.name} />
          </div>
        </article>

        <article className="hs-card hs-card--app" aria-label={`${software.name}, ${software.category}`}>
          <Bar host={software.host} />
          <div className="hs-card__frames hs-card__frames--app">
            <Image src={software.image} alt={software.alt} sizes="(min-width: 64rem) 280px, 40vw" className="is-active" />
          </div>
          <div className="hs-card__label">
            <div>
              <p className="hs-card__name">{software.name}</p>
              <p className="hs-card__cat">{software.category}</p>
            </div>
            <LiveLink href={software.url} name={software.name} />
          </div>
        </article>
      </div>

      <div className="hs__controls">
        <div className="hs__dots" role="group" aria-label="Choose a featured project">
          {items.map((p, i) => (
            <button key={p.slug} type="button" aria-pressed={i === index} className="hs__dot" onClick={() => go(i)}>
              <span className="hs__dot-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="hs__dot-name">{p.name}</span>
              <span className="hs__progress" aria-hidden="true">
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
        {!reduced && (
          <button
            type="button"
            className="hs__pause"
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
      <p className="visually-hidden" aria-live="polite">
        Featured: {current.name}, {current.sector}
      </p>
    </div>
  );
}
