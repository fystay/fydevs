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
  aim: Point; // the point on that screen the camera dives towards
  sCover: number; // the zoom at which the screen fills the stage
  full: Point[]; // the website squared up and filling the stage (16:10, cropped to the view)
  display: Point[]; // the showcase laptop's display, where it ends up
  W: number;
  H: number;
  d: Box; // the display's box in the showcase
};

/** The three acts of the scroll: dive into the screen, square it up while it fills the view, pull back. */
const DIVE_END = 0.42;
const SQUARE_END = 0.58;

const corners = ({ x, y, w, h }: Box): Point[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** The quad scaled by s about point c, which is moved to t. */
const place = (q: Point[], c: Point, s: number, t: Point) => q.map(([x, y]): Point => [t[0] + s * (x - c[0]), t[1] + s * (y - c[1])]);

/** Whether the quad contains every corner of the w×h stage. */
function covers(q: Point[], w: number, h: number) {
  return corners({ x: 0, y: 0, w, h }).every(([x, y]) =>
    q.every((a, i) => {
      const b = q[(i + 1) % 4];
      return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) >= 0;
    }),
  );
}

/** True while the zoom is still playing; the showcase holds its slideshow until it settles. */
export const ZoomSettledContext = createContext(true);

/**
 * Scroll-driven zoom through the hero laptop. While the visitor scrolls through a runway,
 * the hero stays pinned and the camera dives into the website on the laptop screen
 * until it fills the view; the showcase sits over the hero in perspective, its laptop
 * display exactly on the photo's screen, so the two move as one. With only the website
 * in view it squares up to face the viewer (the photo's angle is never seen changing),
 * then the camera pulls back to reveal the showcase laptop, settling exactly where the
 * showcase section sits. Scrolling then carries on with no swap.
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
    const veil = stage?.querySelector<HTMLElement>(".zoom__veil");
    if (!root || !stage || !panel || !heroEl || !photo || !copy || !display || !veil) return;

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
      const centre: Point = [W / 2, H / 2];
      // The smallest zoom at which the screen, aimed at point c and centred, fills the stage.
      const coverZoom = (c: Point) => {
        let lo = 1;
        let hi = 80;
        for (let i = 0; i < 30; i++) {
          const mid = (lo + hi) / 2;
          if (covers(place(q0, c, mid, centre), W, H)) hi = mid;
          else lo = mid;
        }
        return hi;
      };
      // Dive towards the point on the screen that needs the least zoom (the screen is at an angle).
      let aim: Point = q0[0];
      let sCover = Infinity;
      for (let a = 0.15; a <= 0.851; a += 0.05) {
        for (let b = 0.15; b <= 0.851; b += 0.05) {
          const top: Point = [lerp(q0[0][0], q0[1][0], a), lerp(q0[0][1], q0[1][1], a)];
          const bottom: Point = [lerp(q0[3][0], q0[2][0], a), lerp(q0[3][1], q0[2][1], a)];
          const c: Point = [lerp(top[0], bottom[0], b), lerp(top[1], bottom[1], b)];
          const z = coverZoom(c);
          if (z < sCover) {
            sCover = z;
            aim = c;
          }
        }
      }
      sCover *= 1.04;
      const box = layoutBox(display, panel);
      // The website squared up and filling the stage, at the display's proportions.
      const fw = Math.max(W, (H * box.w) / box.h) * 1.02;
      const fh = (fw * box.h) / box.w;
      geo = { q0, aim, sCover, full: corners({ x: (W - fw) / 2, y: (H - fh) / 2, w: fw, h: fh }), display: corners(box), W, H, d: box };
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

      const { q0, aim, sCover, full, display: end, W, H, d } = geo;
      // Act 1: the camera dives into the website on the laptop screen until it fills the view.
      // The photo and the screen move as one, so nothing on screen changes angle yet.
      const u = easeInOut(clamp(p / DIVE_END));
      const s = sCover ** u;
      const t: Point = [lerp(aim[0], W / 2, u), lerp(aim[1], H / 2, u)];
      const dived = place(q0, aim, s, t);
      let quad = dived;
      if (p > DIVE_END && p <= SQUARE_END) {
        // Act 2: with only the website in view, it squares up to face the viewer.
        const v = easeInOut((p - DIVE_END) / (SQUARE_END - DIVE_END));
        quad = dived.map(([x, y], i): Point => [lerp(x, full[i][0], v), lerp(y, full[i][1], v)]);
      } else if (p > SQUARE_END) {
        // Act 3: the camera pulls back, revealing the laptop around the website.
        const v = easeInOut((p - SQUARE_END) / (1 - SQUARE_END));
        const fw = full[1][0] - full[0][0];
        const w = fw * (d.w / fw) ** v; // a steady zoom out
        const k = (fw - w) / (fw - d.w || 1);
        const cx = lerp((full[0][0] + full[1][0]) / 2, d.x + d.w / 2, k);
        const cy = lerp((full[0][1] + full[3][1]) / 2, d.y + d.h / 2, k);
        const h = (w * d.h) / d.w;
        quad = p >= 1 ? end : corners({ x: cx - w / 2, y: cy - h / 2, w, h });
      }

      // 3D transforms keep each layer rasterised once, so Safari never re-renders mid-zoom (no pops).
      heroEl.style.transform = p > 0 ? `translate3d(${t[0] - s * aim[0]}px, ${t[1] - s * aim[1]}px, 0) scale3d(${s}, ${s}, 1)` : "";
      // Once the website fills the view the photo is hidden behind it.
      heroEl.style.visibility = p >= DIVE_END ? "hidden" : "";
      // As the camera centres on the screen the photo may slide; soften its right edge if it comes into view.
      const exposed = W - (t[0] + s * (W - aim[0]));
      veil.style.width = exposed > 0 && p < DIVE_END ? `${exposed + 96}px` : "";
      const copyFade = 1 - smoothstep(0, 0.18, p);
      copy.style.opacity = copyFade < 1 ? String(copyFade) : "";
      copy.style.pointerEvents = copyFade < 0.5 ? "none" : "";

      panel.style.transform = p >= 1 ? "" : `${rectToQuad(d.w, d.h, quad)} translate(${-d.x}px, ${-d.y}px)`;
      // The bezel and keyboard come into view as the camera pulls back; the tabs once it has landed.
      panel.style.setProperty("--zoom-ui", String(smoothstep(SQUARE_END, SQUARE_END + 0.12, p)));
      panel.style.setProperty("--zoom-tabs", String(smoothstep(0.85, 0.99, p)));
      panel.style.setProperty("--glare", String(1 - smoothstep(0, DIVE_END, p)));
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
      for (const el of [heroEl, copy, panel, veil]) el.removeAttribute("style");
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
        <div className="zoom__veil" aria-hidden="true" />
        <div ref={panelRef} className="zoom__panel">
          <div className="zoom__column">
            <ZoomSettledContext.Provider value={settled}>{children}</ZoomSettledContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
