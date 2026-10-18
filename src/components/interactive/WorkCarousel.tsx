"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { ArrowLeft, ArrowRight } from "../Icons";
import { ScrollShot } from "./ScrollShot";
import { Tilt } from "./Tilt";

type Item = Pick<Project, "slug" | "name" | "sector" | "location" | "host" | "page" | "kind">;

/**
 * A full-bleed, swipeable row of projects. Native scroll-snap handles touch and
 * trackpads; mouse users can also drag. Each card scrolls its site on hover.
 */
export function WorkCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    let nearest = 0;
    cards.forEach((card, i) => {
      if (Math.abs(card.offsetLeft - track.offsetLeft - left) < Math.abs(cards[nearest].offsetLeft - track.offsetLeft - left)) {
        nearest = i;
      }
    });
    setActive(nearest);
    setAtStart(left < 8);
    setAtEnd(left + track.clientWidth >= track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.children[0] as HTMLElement | undefined;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const track = trackRef.current!;
    drag.current = { x: e.clientX, left: track.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const track = trackRef.current;
    if (!d || !track) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      track.dataset.dragging = "true";
      track.setPointerCapture(e.pointerId);
    }
    if (d.moved) track.scrollLeft = d.left - dx;
  };

  const endDrag = () => {
    const track = trackRef.current;
    const d = drag.current;
    drag.current = null;
    if (!track || !d?.moved) return;
    delete track.dataset.dragging;
    // Swallow the click that follows a drag so cards don't navigate.
    const block = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    track.addEventListener("click", block, { capture: true, once: true });
    window.setTimeout(() => track.removeEventListener("click", block, { capture: true }), 50);
  };

  return (
    <div className="carousel">
      <ul
        ref={trackRef}
        role="list"
        className="carousel__track"
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-label="Selected projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
      >
        {items.map((p, i) => (
          <li key={p.slug} className={`carousel__item${i === active ? " is-current" : ""}`} aria-label={`${i + 1} of ${items.length}: ${p.name}`}>
            <Tilt className="carousel__tilt" max={4}>
              <Link href={`/work#${p.slug}`} className="carousel__card scroll-trigger" draggable={false}>
                <ScrollShot
                  src={p.page}
                  host={p.host}
                  alt={`The ${p.name} website`}
                  sizes="(min-width: 64rem) 640px, 84vw"
                />
                <span className="carousel__meta">
                  <span className="carousel__name">{p.name}</span>
                  <span className="carousel__sector">
                    {p.sector}
                    <span>{p.kind === "product" ? "Our platform" : p.location}</span>
                  </span>
                  <span className="carousel__go" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </span>
              </Link>
            </Tilt>
          </li>
        ))}
      </ul>

      <div className="container container--wide carousel__controls">
        <p className="carousel__count" aria-hidden="true">
          <span>{String(active + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
        </p>
        <div className="carousel__dots" aria-hidden="true">
          {items.map((p, i) => (
            <span key={p.slug} className={i === active ? "is-active" : undefined} />
          ))}
        </div>
        <div className="carousel__buttons">
          <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label="Previous project">
            <ArrowLeft size={16} />
          </button>
          <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label="Next project">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
