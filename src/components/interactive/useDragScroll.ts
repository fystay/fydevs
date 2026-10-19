"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared behaviour for horizontal scroll-snap tracks: tracks the current item,
 * steps by one card, lets mouse users drag, and swallows the click after a drag.
 * Touch and trackpads use native scrolling.
 */
export function useDragScroll<T extends HTMLElement>() {
  const trackRef = useRef<T>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;
    const left = track.scrollLeft;
    const offset = (card: HTMLElement) => Math.abs(card.offsetLeft - track.offsetLeft - left);
    let nearest = 0;
    cards.forEach((card, i) => {
      if (offset(card) < offset(cards[nearest])) nearest = i;
    });
    const end = left + track.clientWidth >= track.scrollWidth - 8;
    setActive(end ? cards.length - 1 : nearest);
    setAtStart(left < 8);
    setAtEnd(end);
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
    drag.current = { x: e.clientX, left: trackRef.current!.scrollLeft, moved: false };
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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return {
    trackRef,
    active,
    atStart,
    atEnd,
    step,
    trackProps: {
      onScroll: measure,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onKeyDown,
      tabIndex: 0,
    },
  };
}
