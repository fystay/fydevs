"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import drCalendar from "../../../public/work/app/dr-calendar.webp";
import drJob from "../../../public/work/app/dr-job.webp";
import drJobs from "../../../public/work/app/dr-jobs.webp";
import opBookings from "../../../public/work/app/op-bookings.webp";
import opJob from "../../../public/work/app/op-job.webp";
import opToday from "../../../public/work/app/op-today.webp";

type Screen = { src: StaticImageData; title: string; alt: string };

/** Real screens from the live system; customer and driver details are replaced with examples. */
export const APPS: Record<"operator" | "driver", { label: string; screens: Screen[] }> = {
  operator: {
    label: "Operator app",
    screens: [
      {
        src: opToday,
        title: "Today",
        alt: "Operator app, Today: jobs today, messages to reply to, bookings needing a driver, and drivers on shift",
      },
      {
        src: opBookings,
        title: "Bookings",
        alt: "Operator app, Bookings: upcoming transfers by day, each with pickup, drop-off, price, driver and status",
      },
      {
        src: opJob,
        title: "Job detail",
        alt: "Operator app, a booking: call and WhatsApp buttons, route, and actions to edit or create a return journey",
      },
    ],
  },
  driver: {
    label: "Driver app",
    screens: [
      {
        src: drJobs,
        title: "Jobs",
        alt: "Driver app, Jobs: upcoming transfers with times, routes, references and payment status",
      },
      {
        src: drJob,
        title: "On the job",
        alt: "Driver app, a job: passenger contact, route with directions, and the verified flight's arrival time",
      },
      {
        src: drCalendar,
        title: "Calendar",
        alt: "Driver app, Calendar: jobs and earnings for the month, with the day's jobs below",
      },
    ],
  },
};

const KEYS = Object.keys(APPS) as (keyof typeof APPS)[];

/**
 * A tour of the operator and driver apps on one strip of phones: swipe (or drag) from the
 * operator's screens across to the driver's. The switch above follows along, and tapping
 * it jumps straight to that app.
 */
export function AppTour() {
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const app = progress < 0.5 ? KEYS[0] : KEYS[1];

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // 0 on the operator's first screen, 1 once the driver's first screen is reached.
    const onScroll = () => {
      const driver = el.querySelector<HTMLElement>(`[data-app="${KEYS[1]}"]`);
      const end = Math.min(driver?.offsetLeft ?? 0, el.scrollWidth - el.clientWidth);
      setProgress(end > 0 ? Math.min(1, el.scrollLeft / end) : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const show = (key: keyof typeof APPS) => {
    const el = track.current;
    const first = el?.querySelector<HTMLElement>(`[data-app="${key}"]`);
    // The strip is positioned, so offsetLeft is measured from its start.
    if (el && first) el.scrollTo({ left: key === KEYS[0] ? 0 : first.offsetLeft, behavior: "smooth" });
  };

  // A mouse can drag the strip too; touch and trackpads scroll it natively.
  const drag = useRef<{ x: number; left: number } | null>(null);

  return (
    <div className="app-tour">
      <div
        className="app-tour__switch"
        role="group"
        aria-label="Choose an app"
        style={{ "--p": progress } as React.CSSProperties}
      >
        {KEYS.map((key) => (
          <button key={key} type="button" aria-pressed={app === key} onClick={() => show(key)}>
            {APPS[key].label}
          </button>
        ))}
      </div>
      <ul
        ref={track}
        role="list"
        className="app-tour__screens"
        tabIndex={0}
        aria-label="Operator and driver app screens"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft };
          track.current.dataset.dragging = "true";
          track.current.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current && track.current)
            track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          const el = track.current;
          if (!drag.current || !el) return;
          const moved = el.scrollLeft - drag.current.left;
          drag.current = null;
          delete el.dataset.dragging;
          // Settle on the app the drag was heading towards.
          if (Math.abs(moved) > 40) show(moved > 0 ? KEYS[1] : KEYS[0]);
          else show(app);
        }}
      >
        {KEYS.flatMap((key) =>
          APPS[key].screens.map((s, i) => (
            <li key={s.title} data-app={i === 0 ? key : undefined} className={i === 0 ? "app-tour__first" : undefined}>
              <figure className="app-phone">
                <Image
                  src={s.src}
                  alt={s.alt}
                  sizes="(min-width: 64rem) 300px, 70vw"
                  placeholder="blur"
                  draggable={false}
                />
              </figure>
              <p className="app-tour__app">{APPS[key].label}</p>
              <h3>{s.title}</h3>
            </li>
          )),
        )}
      </ul>
      <p className="app-tour__note">Real screens · Example details</p>
    </div>
  );
}
