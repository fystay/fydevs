"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "./Icons";

/** Pages that already are the next step, so the bar would only get in the way. */
const HIDDEN_ON = ["/contact", "/build"];

/**
 * Phones and tablets: once the visitor has scrolled past the opening screen, a slim bar
 * slides up with the two next steps. It steps aside while anything that already offers
 * them is on screen (the hero zoom and showcase, any button, call-to-action bands, the
 * footer), so it never doubles up or covers a button.
 */
export function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (HIDDEN_ON.includes(pathname)) return;
    const blockers = new Set<Element>();
    let frame = 0;
    const update = () => {
      frame = 0;
      setShow(window.scrollY > window.innerHeight * 0.75 && blockers.size === 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) blockers.add(e.target);
        else blockers.delete(e.target);
      }
      schedule();
    });
    // Any other call-to-action button on screen already offers the next step.
    document
      .querySelectorAll(".zoom, .cta-band, .site-footer, [data-cta-hide], main .btn")
      .forEach((el) => io.observe(el));
    window.addEventListener("scroll", schedule, { passive: true });
    schedule();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
      setShow(false);
    };
  }, [pathname]);

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <div className="sticky-cta" data-show={show} inert={!show}>
      <Link href="/contact?topic=website" className="btn btn--primary">
        Start a Project
        <ArrowRight />
      </Link>
      <Link href="/build" className="btn btn--secondary">
        Get a price
      </Link>
    </div>
  );
}
