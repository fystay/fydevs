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

/** A flat rectangle's pose in 3D: rotations (radians), scale, and where its centre sits. */
type Pose = { rx: number; ry: number; rz: number; k: number; tx: number; ty: number };

type Geometry = {
  q0: Point[]; // the screen in the photo, in stage pixels
  c0: Point; // its centre
  sDive: number; // how far the camera dives: until the website spans the view's width
  start: Pose; // the website's 3D pose at the end of the dive (fitted to the photo's angle)
  end: Pose; // facing the viewer, in the showcase laptop
  P: number; // perspective distance
  W: number;
  H: number;
  d: Box; // the showcase display's box
};

/** The scroll in two acts: dive into the screen, then turn to face the viewer while pulling back. */
const DIVE_END = 0.4;

/** The quad scaled by s about point c, which is moved to t. */
const place = (q: Point[], c: Point, s: number, t: Point) => q.map(([x, y]): Point => [t[0] + s * (x - c[0]), t[1] + s * (y - c[1])]);

/** Where the corners of a w×h rectangle in the given pose appear, seen in perspective from the stage centre. */
function project(w: number, h: number, { rx, ry, rz, k, tx, ty }: Pose, P: number, centre: Point): Point[] {
  const [cx, cy] = [Math.cos(rx), Math.sin(rx)];
  const [cyy, sy] = [Math.cos(ry), Math.sin(ry)];
  const [cz, sz] = [Math.cos(rz), Math.sin(rz)];
  return (
    [
      [-w / 2, -h / 2],
      [w / 2, -h / 2],
      [w / 2, h / 2],
      [-w / 2, h / 2],
    ] as Point[]
  ).map(([u, v]): Point => {
    // Rotate about z, then y, then x; then scale and move.
    let x = u * cz - v * sz;
    let y = u * sz + v * cz;
    let z = 0;
    [x, z] = [x * cyy + z * sy, -x * sy + z * cyy];
    [y, z] = [y * cx - z * cy, y * cy + z * cx];
    x = x * k + tx;
    y = y * k + ty;
    z *= k;
    const f = P / (P - z);
    return [centre[0] + (x - centre[0]) * f, centre[1] + (y - centre[1]) * f];
  });
}

/**
 * The poses a w×h rectangle could have to look like the quad when seen straight on (no
 * perspective): its edges give the projected axes, and the missing depths follow from
 * the rectangle's axes being perpendicular and of equal scale. Two mirror-image answers.
 */
function posesFromShape(q: Point[], w: number, h: number): Pose[] {
  const a: Point = [(q[1][0] - q[0][0] + q[2][0] - q[3][0]) / (2 * w), (q[1][1] - q[0][1] + q[2][1] - q[3][1]) / (2 * w)];
  const b: Point = [(q[3][0] - q[0][0] + q[2][0] - q[1][0]) / (2 * h), (q[3][1] - q[0][1] + q[2][1] - q[1][1]) / (2 * h)];
  const A = a[0] ** 2 + a[1] ** 2;
  const B = b[0] ** 2 + b[1] ** 2;
  const C = a[0] * b[0] + a[1] * b[1];
  // With m = 1/k²: (1 − A·m)(1 − B·m) = C²·m², the smaller root being the one with real depths.
  const qa = A * B - C * C;
  const m = qa > 1e-12 ? (A + B - Math.sqrt(Math.max(0, (A + B) ** 2 - 4 * qa))) / (2 * qa) : 1 / Math.max(A, B);
  const k = 1 / Math.sqrt(m);
  const centre: Point = [q.reduce((t, p) => t + p[0], 0) / 4, q.reduce((t, p) => t + p[1], 0) / 4];
  return [1, -1].map((sign) => {
    const z1 = sign * Math.sqrt(Math.max(0, 1 - A * m));
    const z2 = Math.abs(z1) > 1e-6 ? (-C * m) / z1 : sign * Math.sqrt(Math.max(0, 1 - B * m));
    const r1 = [a[0] / k, a[1] / k, z1];
    const r2 = [b[0] / k, b[1] / k, z2];
    const r3 = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]];
    // R = Rx·Ry·Rz with columns r1, r2, r3 (see project()).
    const ry = Math.asin(clamp(r3[0], -1, 1));
    const rz = Math.atan2(-r2[0], r1[0]);
    const rx = Math.atan2(-r3[1], r3[2]);
    return { rx, ry, rz, k, tx: centre[0], ty: centre[1] };
  });
}

/**
 * The pose whose perspective view, from a camera at distance P looking at the centre, best
 * matches the quad, refined from the shape's answers. The photo isn't a physically exact
 * view, so the match is close rather than exact; the scroll blends away the difference.
 */
function fitPose(q: Point[], w: number, h: number, P: number, centre: Point): Pose {
  const toPose = (v: number[]): Pose => ({ rx: v[0], ry: v[1], rz: v[2], k: v[3], tx: v[4], ty: v[5] });
  const err = (v: number[]) => project(w, h, toPose(v), P, centre).reduce((e, [x, y], i) => e + (x - q[i][0]) ** 2 + (y - q[i][1]) ** 2, 0);
  const refine = (x0: number[]) => {
    const steps = [0.05, 0.05, 0.05, x0[3] * 0.05, 8, 8];
    let simplex = [x0, ...steps.map((st, i) => x0.map((v, j) => (i === j ? v + st : v)))].map((v) => ({ v, e: err(v) }));
    for (let it = 0; it < 800; it++) {
      simplex.sort((p1, p2) => p1.e - p2.e);
      const n = simplex.length - 1;
      const mid = simplex[0].v.map((_, j) => simplex.slice(0, n).reduce((t, s) => t + s.v[j], 0) / n);
      const at = (t: number) => mid.map((mm, j) => mm + t * (simplex[n].v[j] - mm));
      const r = at(-1);
      const er = err(r);
      if (er < simplex[0].e) {
        const e2 = at(-2);
        const ee = err(e2);
        simplex[n] = ee < er ? { v: e2, e: ee } : { v: r, e: er };
      } else if (er < simplex[n - 1].e) simplex[n] = { v: r, e: er };
      else {
        const c = at(0.5);
        const ec = err(c);
        if (ec < simplex[n].e) simplex[n] = { v: c, e: ec };
        else simplex = simplex.map((s, i) => (i ? s.v.map((x, j) => (x + simplex[0].v[j]) / 2) : s.v)).map((v) => ({ v, e: err(v) }));
      }
    }
    simplex.sort((p1, p2) => p1.e - p2.e);
    return simplex[0];
  };
  const best = posesFromShape(q, w, h)
    .map((p) => refine([p.rx, p.ry, p.rz, p.k, p.tx, p.ty]))
    .sort((p1, p2) => p1.e - p2.e)[0];
  return toPose(best.v);
}

/** True while the zoom is still playing; the showcase holds its slideshow until it settles. */
export const ZoomSettledContext = createContext(true);

/**
 * Scroll-driven zoom through the hero laptop. While the visitor scrolls through a runway,
 * the hero stays pinned and the camera dives into the website on the laptop screen until
 * it spans the view, as the desk fades away; the showcase sits over the hero in
 * perspective, its laptop display exactly on the photo's screen, so the two move as one.
 * The website then turns in 3D to face the viewer (its real angle in the photo, eased to
 * flat) while the camera pulls back, and the laptop's bezel and keyboard arrive as it
 * squares up, settling exactly where the showcase section sits.
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
      const c0: Point = [q0.reduce((a, p) => a + p[0], 0) / 4, q0.reduce((a, p) => a + p[1], 0) / 4];
      const d = layoutBox(display, panel);
      const centre: Point = [W / 2, H / 2];
      // Dive only until the website spans the view's width (any further and its pixels show).
      const q0w = (Math.hypot(q0[1][0] - q0[0][0], q0[1][1] - q0[0][1]) + Math.hypot(q0[2][0] - q0[3][0], q0[2][1] - q0[3][1])) / 2;
      const sDive = Math.max(1, (W * 1.04) / q0w);
      // The website's real 3D angle at that moment, so it can turn to face the viewer as a flat card would.
      const P = Math.max(W, H) * 3;
      const start = fitPose(place(q0, c0, sDive, centre), d.w, d.h, P, centre);
      const end: Pose = { rx: 0, ry: 0, rz: 0, k: 1, tx: d.x + d.w / 2, ty: d.y + d.h / 2 };
      geo = { q0, c0, sDive, start, end, P, W, H, d };
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

      const { q0, c0, sDive, start, end, P, W, H, d } = geo;
      const centre: Point = [W / 2, H / 2];
      // Act 1: the camera dives into the website on the laptop screen; photo and screen move as one.
      const u = easeInOut(clamp(p / DIVE_END));
      const s = sDive ** u;
      const t: Point = [lerp(c0[0], centre[0], u), lerp(c0[1], centre[1], u)];
      let quad = place(q0, c0, s, t);
      // Over the second half of the dive, as the desk fades, ease from the photo's outline onto the fitted 3D pose.
      const onPose = smoothstep(DIVE_END * 0.5, DIVE_END, p);
      if (onPose > 0) {
        // Act 2: a real 3D turn to face the viewer, while the camera pulls back to the laptop.
        const v = easeInOut(clamp((p - DIVE_END) / (1 - DIVE_END)));
        const pose: Pose = {
          rx: lerp(start.rx, end.rx, v),
          ry: lerp(start.ry, end.ry, v),
          rz: lerp(start.rz, end.rz, v),
          k: start.k * (end.k / start.k) ** v, // a steady zoom out
          tx: lerp(start.tx, end.tx, v),
          ty: lerp(start.ty, end.ty, v),
        };
        const turned = project(d.w, d.h, pose, P, centre);
        quad = quad.map(([x, y], i): Point => [lerp(x, turned[i][0], onPose), lerp(y, turned[i][1], onPose)]);
      }

      // 3D transforms keep each layer rasterised once, so Safari never re-renders mid-zoom (no pops).
      heroEl.style.transform = p > 0 ? `translate3d(${t[0] - s * c0[0]}px, ${t[1] - s * c0[1]}px, 0) scale3d(${s}, ${s}, 1)` : "";
      // The desk fades to the page colour as the website comes to fill the view.
      const photoFade = smoothstep(DIVE_END * 0.45, DIVE_END * 0.95, p);
      heroEl.style.opacity = photoFade > 0 ? String(1 - photoFade) : "";
      heroEl.style.visibility = photoFade >= 1 ? "hidden" : "";
      const exposed = W - (t[0] + s * (W - c0[0]));
      veil.style.width = exposed > 0 && photoFade < 1 ? `${exposed + 96}px` : "";
      const copyFade = 1 - smoothstep(0, 0.16, p);
      copy.style.opacity = copyFade < 1 ? String(copyFade) : "";
      copy.style.pointerEvents = copyFade < 0.5 ? "none" : "";

      panel.style.transform = p >= 1 ? "" : `${rectToQuad(d.w, d.h, quad)} translate(${-d.x}px, ${-d.y}px)`;
      // The bezel and keyboard arrive only once the screen has nearly turned to face you; then the tabs.
      panel.style.setProperty("--zoom-ui", String(smoothstep(0.78, 0.95, p)));
      panel.style.setProperty("--zoom-tabs", String(smoothstep(0.88, 0.99, p)));
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
