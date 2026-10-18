"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Eases [data-reveal] elements in as they enter the viewport. Content is only hidden
 * once this script has run, never for reduced-motion users, and anything already on
 * screen is marked visible before the hiding class is applied, so nothing flashes.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const vh = window.innerHeight;
    for (const el of items) {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("is-in");
    }
    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
