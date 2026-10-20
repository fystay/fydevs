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

/** The laptop's pose in 3D: rotations (radians), scale, and where its screen's centre sits. */
type Pose = { rx: number; ry: number; rz: number; k: number; tx: number; ty: number };

type Geometry = {
  start: Pose; // over the laptop in the photo, at its angle
  end: Pose; // in place in the showcase, facing the viewer
  origin: string; // the screen's centre within the laptop body, the point it turns about
  slack: number; // empty stage below the landed showcase, which the next section scrolls up into
};

/** The angle the base hinges back from the lid (matches .laptop__base in the CSS). */
const HINGE = (82 * Math.PI) / 180;

/** A vector turned by the pose's rotations: about z, then y, then x (as CSS applies them). */
function rotate([x, y, z]: number[], { rx, ry, rz }: Pose) {
  [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
  [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
  [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
  return [x, y, z];
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

/** True while the zoom is still playing; the showcase holds its slideshow until it settles. */
export const ZoomSettledContext = createContext(true);

/**
 * Scroll-driven move of the hero laptop into the showcase. The showcase laptop is a real 3D
 * object (lid and hinged keyboard base). While the visitor scrolls through a runway, the
 * hero stays pinned: the 3D laptop appears over the laptop in the photo, at its angle, as
 * the desk fades away, then turns to face the viewer and settles in the showcase, moving
 * as one solid object the whole way, so it never stretches or loses its shape. The website
 * stays in its screen throughout. Scrolling then carries on with no swap.
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
    const view = panel?.querySelector<HTMLElement>(".laptop__view");
    const body = panel?.querySelector<HTMLElement>(".laptop__body");
    const display = panel?.querySelector<HTMLElement>(".laptop__display");
    const showcase = panel?.querySelector<HTMLElement>(".showcase");
    if (!root || !stage || !panel || !heroEl || !photo || !copy || !view || !body || !display || !showcase) return;

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
      const d = layoutBox(display, panel);
      const inBody = layoutBox(display, body);
      // The laptop's angle in the photo, worked out from the shape of its screen. Of the two
      // mirror-image answers, take the one that shows the keyboard from above, as the photo does.
      const baseNormal = [0, -Math.sin(HINGE), Math.cos(HINGE)];
      const [pose] = posesFromShape(q0, d.w, d.h).sort((a, b) => rotate(baseNormal, b)[2] - rotate(baseNormal, a)[2]);
      const centre: Point = [d.x + d.w / 2, d.y + d.h / 2];
      const start: Pose = { ...pose, tx: pose.tx - centre[0], ty: pose.ty - centre[1] };
      const end: Pose = { rx: 0, ry: 0, rz: 0, k: 1, tx: 0, ty: 0 };
      // The landed showcase rarely fills the stage; the next section rises into the space below it.
      const sc = layoutBox(showcase, panel);
      const slack = Math.max(0, Math.round(H - (sc.y + sc.h) - 8));
      root.style.setProperty("--zoom-slack", `${slack}px`);
      geo = { start, end, origin: `${inBody.x + inBody.w / 2}px ${inBody.y + inBody.h / 2}px`, slack };
      body.style.transformOrigin = geo.origin;
      progress = -1;
    };

    const render = () => {
      frame = 0;
      if (!geo) return;
      const run = root.offsetHeight - stage.offsetHeight;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const travelled = top - root.getBoundingClientRect().top;
      // The move finishes before the pin releases; the rest of the run brings the next section up.
      const zoomRun = run - geo.slack;
      // A couple of pixels' tolerance absorbs sub-pixel header heights.
      const p = zoomRun > 0 && travelled > 2 ? clamp(travelled / zoomRun) : 0;
      if (p === progress) return;
      progress = p;

      const { start, end } = geo;
      // The laptop moves as one rigid object: turn, scale and position all ease together.
      const v = easeInOut(smoothstep(0.04, 1, p));
      const pose: Pose = {
        rx: lerp(start.rx, end.rx, v),
        ry: lerp(start.ry, end.ry, v),
        rz: lerp(start.rz, end.rz, v),
        k: start.k * (end.k / start.k) ** v,
        tx: lerp(start.tx, end.tx, v),
        ty: lerp(start.ty, end.ty, v),
      };
      body.style.transform =
        p >= 1
          ? ""
          : `translate3d(${pose.tx.toFixed(2)}px, ${pose.ty.toFixed(2)}px, 0) rotateX(${pose.rx.toFixed(4)}rad) rotateY(${pose.ry.toFixed(4)}rad) rotateZ(${pose.rz.toFixed(4)}rad) scale(${pose.k.toFixed(4)})`;
      // It takes over from the photo's laptop as the desk and the hero copy fade away.
      const device = smoothstep(0.02, 0.16, p);
      view.style.opacity = device < 1 ? String(device) : "";
      const photoFade = smoothstep(0.06, 0.3, p);
      heroEl.style.opacity = photoFade > 0 ? String(1 - photoFade) : "";
      heroEl.style.visibility = photoFade >= 1 ? "hidden" : "";
      const copyFade = 1 - smoothstep(0, 0.15, p);
      copy.style.opacity = copyFade < 1 ? String(copyFade) : "";
      copy.style.pointerEvents = copyFade < 0.5 ? "none" : "";

      // The project tabs and links arrive once the laptop has squared up, so their text is
      // never slanted, and quickly, so they never sit half-faded like disabled buttons.
      panel.style.setProperty("--zoom-tabs", String(smoothstep(0.93, 0.99, p)));
      panel.style.setProperty("--glare", String(1 - smoothstep(0, 0.6, p)));
      panel.style.pointerEvents = p >= 1 ? "" : "none";
      const state = p >= 1 ? "done" : p > 0 ? "active" : "start";
      if (root.dataset.zoom !== state) {
        root.dataset.zoom = state;
        // The slideshow only runs once the move has landed, so the screen never changes project mid-scroll.
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
      const run = root.offsetHeight - stage.offsetHeight - (geo?.slack ?? 0);
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
      ro.observe(showcase);
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
      for (const el of [heroEl, copy, panel, view, body]) el.removeAttribute("style");
      root.style.removeProperty("--zoom-slack");
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
