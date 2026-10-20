"use client";

import { createContext, useEffect, useRef, useState, type ReactNode } from "react";

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
  c0: Point; // its centre, which the camera moves towards
  cf: Point; // the stage centre
  final: Point[]; // the panel's corners once it faces the viewer and fills the stage
  sEnd: number; // the zoom at the end of the camera move
  pCover: number; // progress from which the screen covers the whole stage
  pw: number;
  ph: number;
};

/** Progress through the camera move (zoom and centring), finished a little before the end. */
const ZOOM_END = 0.8;

/** Whether the quad contains every corner of the w×h stage. */
function covers(q: Point[], w: number, h: number) {
  const corners: Point[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  return corners.every(([x, y]) =>
    q.every((a, i) => {
      const b = q[(i + 1) % 4];
      return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) >= 0;
    }),
  );
}

/** True while the zoom is still playing; the showcase holds its slideshow until it settles. */
export const ZoomSettledContext = createContext(true);

/**
 * Scroll-driven zoom into the hero laptop. While the visitor scrolls through a runway,
 * the hero stays pinned and the camera moves into the laptop. The live portfolio (real
 * HTML) sits on the laptop screen in perspective and moves with the photo as one piece,
 * so the two never drift apart. Only once the screen fills the view does it turn to
 * face the viewer, with its edges out of sight, settling exactly where the showcase
 * section sits. Scrolling then carries on with no swap.
 *
 * Without JavaScript, or with reduced motion, nothing is pinned or transformed: the
 * hero and the portfolio sit one after the other, as before.
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
    if (!root || !stage || !panel || !heroEl || !photo || !copy) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let geo: Geometry | null = null;
    let frame = 0;
    let progress = -1;

    // The camera at progress p: zoom s, and where the screen's centre has moved to.
    const camera = (p: number, g: Pick<Geometry, "c0" | "cf" | "sEnd">) => {
      const u = easeInOut(clamp(p / ZOOM_END));
      const s = g.sEnd ** u;
      const t: Point = [lerp(g.c0[0], g.cf[0], u), lerp(g.c0[1], g.cf[1], u)];
      return { s, t };
    };
    const place = (q: Point[], c0: Point, { s, t }: { s: number; t: Point }) =>
      q.map(([x, y]): Point => [t[0] + s * (x - c0[0]), t[1] + s * (y - c0[1])]);

    const measure = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const map = imageMapper(photo, layoutBox(photo, stage));
      const q0 = screen.map(map);
      const cf: Point = [W / 2, H / 2];
      // The panel has the screen's real proportions and, at the end, covers the stage.
      const ph = Math.max(H, W / SCREEN_ASPECT);
      const pw = ph * SCREEN_ASPECT;
      const left = (W - pw) / 2;
      const top = (H - ph) / 2;
      const final: Point[] = [
        [left, top],
        [left + pw, top],
        [left + pw, top + ph],
        [left, top + ph],
      ];
      // The smallest zoom at which the screen, aimed at point c, covers the stage.
      const coverZoom = (c: Point) => {
        let lo = 1;
        let hi = 80;
        for (let i = 0; i < 30; i++) {
          const mid = (lo + hi) / 2;
          if (covers(place(q0, c, { s: mid, t: cf }), W, H)) hi = mid;
          else lo = mid;
        }
        return hi;
      };
      // Aim at the point on the screen that needs the least zoom (the screen is seen at an angle,
      // so that is not its centre); the less it overshoots, the less it settles back at the end.
      let c0: Point = q0[0];
      let best = Infinity;
      for (let a = 0.15; a <= 0.851; a += 0.05) {
        for (let b = 0.15; b <= 0.851; b += 0.05) {
          const top: Point = [lerp(q0[0][0], q0[1][0], a), lerp(q0[0][1], q0[1][1], a)];
          const bottom: Point = [lerp(q0[3][0], q0[2][0], a), lerp(q0[3][1], q0[2][1], a)];
          const c: Point = [lerp(top[0], bottom[0], b), lerp(top[1], bottom[1], b)];
          const z = coverZoom(c);
          if (z < best) {
            best = z;
            c0 = c;
          }
        }
      }
      const sEnd = best * 1.03;
      // The first moment the moving screen covers the stage: it can turn to face the viewer from there.
      let pCover = ZOOM_END;
      for (let i = 0; i <= 200; i++) {
        const p = (i / 200) * ZOOM_END;
        if (covers(place(q0, c0, camera(p, { c0, cf, sEnd })), W, H)) {
          pCover = p;
          break;
        }
      }
      geo = { q0, c0, cf, final, sEnd, pCover, pw, ph };
      panel.style.width = `${pw}px`;
      panel.style.height = `${ph}px`;
      panel.style.setProperty("--col-x", `${-left}px`);
      panel.style.setProperty("--col-y", `${-top}px`);
      panel.style.setProperty("--col-w", `${W}px`);
      panel.style.setProperty("--col-h", `${H}px`);
      root.style.setProperty("--zoom-h", `${H}px`);
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

      const { q0, c0, final, pCover, pw, ph } = geo;
      const cam = camera(p, geo);
      const onScreen = place(q0, c0, cam);
      // Turning to face the viewer happens only while the screen fills the stage.
      const turn = p > pCover ? easeInOut(clamp((p - pCover) / (1 - pCover))) : 0;
      const corners = onScreen.map(([x, y], i): Point => [lerp(x, final[i][0], turn), lerp(y, final[i][1], turn)]);

      // 3D transforms keep each layer rasterised once, so Safari never re-renders mid-zoom (no pops).
      const { s, t } = cam;
      heroEl.style.transform = p > 0 ? `translate3d(${t[0] - s * c0[0]}px, ${t[1] - s * c0[1]}px, 0) scale3d(${s}, ${s}, 1)` : "";
      heroEl.style.visibility = turn > 0 ? "hidden" : "";
      const copyFade = 1 - smoothstep(0, 0.25, p);
      copy.style.opacity = copyFade < 1 ? String(copyFade) : "";
      copy.style.pointerEvents = copyFade < 0.5 ? "none" : "";

      panel.style.transform = p >= 1 ? `translate(${final[0][0]}px, ${final[0][1]}px)` : rectToQuad(pw, ph, corners);
      panel.style.opacity = String(smoothstep(0, 0.06, p));
      panel.style.setProperty("--glare", String((1 - turn) * (1 - smoothstep(0.3, 0.9, p / Math.max(pCover, 0.01)) * 0.6)));
      panel.style.pointerEvents = p >= 1 ? "" : "none";
      const state = p >= 1 ? "done" : p > 0 ? "active" : "start";
      if (root.dataset.zoom !== state) {
        root.dataset.zoom = state;
        setSettled(state !== "active");
      }
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
