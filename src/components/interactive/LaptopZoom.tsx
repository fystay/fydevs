"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Point = [number, number];

/** The four corners of a screen in the photo, in image pixels: top-left, top-right, bottom-right, bottom-left. */
export type ScreenQuad = [Point, Point, Point, Point];

/** The laptop screen's real proportions; the photo shows it in perspective. */
const SCREEN_ASPECT = 1.6;

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

/** CSS matrix3d that maps a w×h box onto the quad (projective transform). */
function rectToQuad(w: number, h: number, [p0, p1, p2, p3]: Point[]) {
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
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map((n) => +n.toFixed(6)).join(",")})`;
}

type Geometry = {
  q0: Point[]; // the screen in the photo, in stage pixels
  r0: Point[]; // the same screen squared up to its real proportions, around the same centre
  c0: Point;
  cf: Point;
  s1: number; // zoom at which the squared-up screen covers the stage
  pw: number;
  ph: number;
};

/**
 * Scroll-driven zoom into the hero laptop. While the visitor scrolls through a runway,
 * the hero stays pinned and the camera moves into the laptop: the photo scales up
 * around the screen, and the live portfolio (real HTML, laid over the screen in
 * perspective) turns to face the viewer until it fills the view. At the end the
 * portfolio is simply the next section, so scrolling carries on with no swap.
 *
 * Without JavaScript, or with reduced motion, nothing is pinned or transformed: the
 * hero and the portfolio sit one after the other, as before.
 */
export function LaptopZoom({ hero, screen, children }: { hero: ReactNode; screen: ScreenQuad; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const panel = panelRef.current;
    const heroEl = stage?.querySelector<HTMLElement>(".hero-ed");
    const photo = heroEl?.querySelector<HTMLImageElement>(".hero-ed__photo");
    const copy = heroEl?.querySelector<HTMLElement>(".hero-ed__layout");
    if (!root || !stage || !panel || !heroEl || !photo || !copy) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let geo: Geometry | null = null;
    let frame = 0;
    let progress = -1;

    const measure = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const map = imageMapper(photo, layoutBox(photo, stage));
      const q0 = screen.map(map);
      const c0: Point = [q0.reduce((s, p) => s + p[0], 0) / 4, q0.reduce((s, p) => s + p[1], 0) / 4];
      const q0h = (Math.hypot(q0[3][0] - q0[0][0], q0[3][1] - q0[0][1]) + Math.hypot(q0[2][0] - q0[1][0], q0[2][1] - q0[1][1])) / 2;
      // The panel has the screen's proportions and covers the stage; its content column is the stage itself.
      const ph = Math.max(H, W / SCREEN_ASPECT);
      const pw = ph * SCREEN_ASPECT;
      const left = (W - pw) / 2;
      const top = (H - ph) / 2;
      const cf: Point = [W / 2, H / 2];
      const s1 = ph / q0h;
      const corners: Point[] = [
        [left, top],
        [left + pw, top],
        [left + pw, top + ph],
        [left, top + ph],
      ];
      const r0 = corners.map(([x, y]): Point => [c0[0] + (x - cf[0]) / s1, c0[1] + (y - cf[1]) / s1]);
      geo = { q0, r0, c0, cf, s1, pw, ph };
      panel.style.width = `${pw}px`;
      panel.style.height = `${ph}px`;
      panel.style.setProperty("--col-x", `${-left}px`);
      panel.style.setProperty("--col-y", `${-top}px`);
      panel.style.setProperty("--col-w", `${W}px`);
      panel.style.setProperty("--col-h", `${H}px`);
      panel.style.setProperty("--bezel", `${(pw * 0.018).toFixed(1)}px`);
      root.style.setProperty("--zoom-h", `${H}px`);
      progress = -1;
    };

    const render = () => {
      frame = 0;
      if (!geo) return;
      const run = root.offsetHeight - stage.offsetHeight;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const travelled = top - root.getBoundingClientRect().top;
      // A couple of pixels' tolerance at each end absorbs sub-pixel header heights.
      const p = run > 0 && travelled > 2 ? clamp(travelled / run) : 0;
      if (p === progress) return;
      progress = p;

      const { q0, r0, c0, cf, s1 } = geo;
      const e = easeInOut(p);
      const s = s1 ** e;
      const t: Point = [lerp(c0[0], cf[0], e), lerp(c0[1], cf[1], e)];
      const flat = smoothstep(0.08, 0.92, e);
      const corners = q0.map(([x, y], i): Point => [
        t[0] + s * (lerp(x, r0[i][0], flat) - c0[0]),
        t[1] + s * (lerp(y, r0[i][1], flat) - c0[1]),
      ]);

      heroEl.style.transform = p > 0 ? `translate(${t[0] - s * c0[0]}px, ${t[1] - s * c0[1]}px) scale(${s})` : "";
      heroEl.style.visibility = p >= 1 ? "hidden" : "";
      const copyFade = 1 - smoothstep(0, 0.28, p);
      copy.style.opacity = copyFade < 1 ? String(copyFade) : "";
      copy.style.pointerEvents = copyFade < 0.5 ? "none" : "";

      panel.style.transform = p >= 1 ? `translate(${(stage.clientWidth - geo.pw) / 2}px, ${(stage.clientHeight - geo.ph) / 2}px)` : rectToQuad(geo.pw, geo.ph, corners);
      panel.style.opacity = String(smoothstep(0, 0.07, p));
      panel.style.setProperty("--glare", String(1 - flat));
      panel.style.pointerEvents = p > 0.98 ? "" : "none";
      root.dataset.zoom = p >= 1 ? "done" : p > 0 ? "active" : "start";
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    // Tabbing into the portfolio before the zoom has finished jumps to its end, so focus is never hidden.
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
          <div className="zoom__column">{children}</div>
        </div>
      </div>
    </div>
  );
}
