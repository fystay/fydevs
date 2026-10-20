"use client";

import { createContext, useEffect, useRef, useState, type ReactNode } from "react";

type Point = [number, number];

/** The four corners of a screen in the photo, in image pixels: top-left, top-right, bottom-right, bottom-left. */
export type ScreenQuad = [Point, Point, Point, Point];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Layout position of el relative to ancestor, ignoring transforms (so entrance animations don't skew it). */
function layoutBox(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** Where image pixel (ix, iy) lands inside an <img>, honouring object-fit and object-position. */
function imageMapper(img: HTMLImageElement, box: { x: number; y: number; w: number; h: number }) {
  const nw = Number(img.getAttribute("width")) || img.naturalWidth;
  const nh = Number(img.getAttribute("height")) || img.naturalHeight;
  const cs = getComputedStyle(img);
  if (cs.objectFit === "cover" || cs.objectFit === "contain") {
    const scale = (cs.objectFit === "cover" ? Math.max : Math.min)(box.w / nw, box.h / nh);
    const [px, py] = cs.objectPosition.split(" ").map((v) => (v.endsWith("%") ? parseFloat(v) / 100 : 0.5));
    const ox = (box.w - nw * scale) * px;
    const oy = (box.h - nh * scale) * py;
    return ([ix, iy]: Point): Point => [box.x + ox + ix * scale, box.y + oy + iy * scale];
  }
  return ([ix, iy]: Point): Point => [box.x + (ix * box.w) / nw, box.y + (iy * box.h) / nh];
}

/** The projective transform taking a w×h box onto the quad, as [a, b, c, d, e, f, g, h]. */
function homography(w: number, h: number, [p0, p1, p2, p3]: Point[]) {
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = det ? (dx3 * dy2 - dx2 * dy3) / det : 0;
  const hh = det ? (dx1 * dy3 - dx3 * dy1) / det : 0;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + hh * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + hh * y3;
  // x' = (a·x + b·y + c) / (g·x + h·y + 1), and likewise y' with d, e, f; x and y in the box.
  return [a / w, b / h, x0, d / w, e / h, y0, g / w, hh / h];
}

/** CSS matrix3d that maps a w×h box onto the quad. */
function rectToQuad(w: number, h: number, quad: Point[]) {
  const [a, b, c, d, e, f, g, hh] = homography(w, h, quad);
  const m = [a, d, 0, g, b, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((n) => +n.toFixed(6)).join(",")})`;
}

type Box = { x: number; y: number; w: number; h: number };

type Geometry = {
  q0: Point[]; // the screen in the photo, in stage pixels
  c0: Point; // its centre
  display: Box; // the showcase laptop's display, where the screen ends up
  cf: Point; // the display's centre
  sEnd: number; // how far the camera zooms: the photo's screen grows to the display's size
};

/** True while the zoom is still playing; the showcase holds its slideshow until it settles. */
export const ZoomSettledContext = createContext(true);

/**
 * Scroll-driven zoom into the hero laptop. While the visitor scrolls through a runway,
 * the hero stays pinned and the camera moves in on the laptop in the photo, bringing it
 * to the centre. The showcase sits over the hero in perspective, its laptop display
 * exactly on the photo's screen, so the website on screen never changes. As the photo
 * fades away the showcase laptop's bezel and keyboard take its place, and the screen
 * turns to face the viewer, settling exactly where the showcase section sits.
 * Scrolling then carries on with no swap.
 *
 * Without JavaScript, or with reduced motion, nothing is pinned or transformed: the
 * hero and the showcase sit one after the other.
 */
export function LaptopZoom({ hero, screen, children }: { hero: ReactNode; screen: ScreenQuad; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const panel = panelRef.current;
    const heroEl = stage?.querySelector<HTMLElement>(".hero-ed");
    const photo = heroEl?.querySelector<HTMLImageElement>(".hero-ed__photo");
    const copy = heroEl?.querySelector<HTMLElement>(".hero-ed__layout");
    const display = panel?.querySelector<HTMLElement>(".laptop__display");
    if (!root || !stage || !panel || !heroEl || !photo || !copy || !display) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let geo: Geometry | null = null;
    let frame = 0;
    let progress = -1;

    const measure = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      panel.style.width = `${W}px`;
      panel.style.height = `${H}px`;
      root.style.setProperty("--zoom-h", `${H}px`);
      const q0 = screen.map(imageMapper(photo, layoutBox(photo, stage)));
      const c0: Point = [q0.reduce((s, p) => s + p[0], 0) / 4, q0.reduce((s, p) => s + p[1], 0) / 4];
      const box = layoutBox(display, panel);
      const q0h = (Math.hypot(q0[3][0] - q0[0][0], q0[3][1] - q0[0][1]) + Math.hypot(q0[2][0] - q0[1][0], q0[2][1] - q0[1][1])) / 2;
      geo = { q0, c0, display: box, cf: [box.x + box.w / 2, box.y + box.h / 2], sEnd: box.h / q0h };
      progress = -1;
    };

    const render = () => {
      frame = 0;
      if (!geo) return;
      const run = root.offsetHeight - stage.offsetHeight;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const travelled = top - root.getBoundingClientRect().top;
      // A couple of pixels' tolerance absorbs sub-pixel header heights.
      const p = run > 0 && travelled > 2 ? clamp(travelled / run) : 0;
      if (p === progress) return;
      progress = p;

      const { q0, c0, display: d, cf, sEnd } = geo;
      // The camera: zoom and centre on the laptop.
      const u = easeInOut(p);
      const s = sEnd ** u;
      const t: Point = [lerp(c0[0], cf[0], u), lerp(c0[1], cf[1], u)];
      // The photo hands over to the showcase laptop while the screen is still on the photo's
      // screen; only once the photo has gone does the screen turn to face the viewer.
      const handover = smoothstep(0.32, 0.58, p);
      const turn = easeInOut(smoothstep(0.52, 1, p));
      const flat: Point[] = [
        [d.x, d.y],
        [d.x + d.w, d.y],
        [d.x + d.w, d.y + d.h],
        [d.x, d.y + d.h],
      ];
      const corners = q0.map(([x, y], i): Point => [
        lerp(t[0] + s * (x - c0[0]), flat[i][0], turn),
        lerp(t[1] + s * (y - c0[1]), flat[i][1], turn),
      ]);

      // 3D transforms keep each layer rasterised once, so Safari never re-renders mid-zoom (no pops).
      heroEl.style.transform = p > 0 ? `translate3d(${t[0] - s * c0[0]}px, ${t[1] - s * c0[1]}px, 0) scale3d(${s}, ${s}, 1)` : "";
      heroEl.style.opacity = handover > 0 ? String(1 - handover) : "";
      heroEl.style.visibility = handover >= 1 ? "hidden" : "";
      const copyFade = 1 - smoothstep(0, 0.22, p);
      copy.style.opacity = copyFade < 1 ? String(copyFade) : "";
      copy.style.pointerEvents = copyFade < 0.5 ? "none" : "";

      panel.style.transform = p >= 1 ? "" : `${rectToQuad(d.w, d.h, corners)} translate(${-d.x}px, ${-d.y}px)`;
      panel.style.setProperty("--zoom-ui", String(handover));
      panel.style.setProperty("--glare", String(1 - turn));
      panel.style.pointerEvents = p >= 1 ? "" : "none";
      const state = p >= 1 ? "done" : p > 0 ? "active" : "start";
      if (root.dataset.zoom !== state) {
        root.dataset.zoom = state;
        // The slideshow only runs once the zoom has landed, so the screen never changes project mid-scroll.
        setSettled(state === "done");
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    // Tabbing into the showcase before the zoom has finished jumps to its end, so focus is never hidden.
    const onFocusIn = () => {
      if (progress >= 1) return;
      const run = root.offsetHeight - stage.offsetHeight;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - top + run, behavior: "instant" });
    };

    let ro: ResizeObserver | null = null;
    const enable = () => {
      root.classList.add("is-zoom");
      measure();
      render();
      window.addEventListener("scroll", schedule, { passive: true });
      ro = new ResizeObserver(remeasure);
      ro.observe(stage);
      ro.observe(display);
      panel.addEventListener("focusin", onFocusIn);
      if (!photo.complete) photo.addEventListener("load", remeasure, { once: true });
    };
    const disable = () => {
      root.classList.remove("is-zoom");
      window.removeEventListener("scroll", schedule);
      ro?.disconnect();
      panel.removeEventListener("focusin", onFocusIn);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const el of [heroEl, copy, panel]) el.removeAttribute("style");
      delete root.dataset.zoom;
      setSettled(true);
    };
    const sync = () => (reduced.matches ? disable() : enable());

    sync();
    reduced.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      disable();
    };
  }, [screen]);

  return (
    <div ref={rootRef} className="zoom">
      <div ref={stageRef} className="zoom__stage">
        {hero}
        <div ref={panelRef} className="zoom__panel">
          <div className="zoom__column">
            <ZoomSettledContext.Provider value={settled}>{children}</ZoomSettledContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
