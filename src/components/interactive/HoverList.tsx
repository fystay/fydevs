"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type HoverItem = { title: string; body: string; href: string; image: StaticImageData; caption: string };

/**
 * Ruled service rows. On devices with a mouse, hovering a row brings up a preview
 * of related work that eases after the cursor. Touch devices get plain rows.
 */
export function HoverList({ items }: { items: HoverItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const tick = () => {
    pos.current.x += (target.current.x - pos.current.x) * 0.16;
    pos.current.y += (target.current.y - pos.current.y) * 0.16;
    const el = previewRef.current;
    if (el) el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    raf.current = requestAnimationFrame(tick);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!enabled) return;
    target.current = { x: e.clientX + 24, y: e.clientY - 90 };
    if (raf.current === null) {
      pos.current = { ...target.current };
      raf.current = requestAnimationFrame(tick);
    }
  };

  const onLeave = () => {
    setActive(null);
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave}>
      <ul role="list" className="hover-list">
        {items.map((item, i) => (
          <li key={item.title} onPointerEnter={() => setActive(i)}>
            <Link href={item.href} className={active === i ? "is-active" : undefined}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      {enabled && (
        <div ref={previewRef} className={`hover-preview${active !== null ? " is-visible" : ""}`} aria-hidden="true">
          {items.map((item, i) => (
            <figure key={item.title} className={i === active ? "is-active" : undefined}>
              <Image src={item.image} alt="" sizes="320px" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
