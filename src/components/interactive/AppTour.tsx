"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import drCalendar from "../../../public/work/app/dr-calendar.webp";
import drJob from "../../../public/work/app/dr-job.webp";
import drJobs from "../../../public/work/app/dr-jobs.webp";
import opBookings from "../../../public/work/app/op-bookings.webp";
import opJob from "../../../public/work/app/op-job.webp";
import opToday from "../../../public/work/app/op-today.webp";

type Screen = { src: StaticImageData; title: string; caption: string; alt: string };

/** Real screens from the live system; customer and driver details are replaced with examples. */
export const APPS: Record<"operator" | "driver", { label: string; screens: Screen[] }> = {
  operator: {
    label: "Operator app",
    screens: [
      {
        src: opToday,
        title: "Today",
        caption: "Jobs, replies and drivers that need you, at a glance.",
        alt: "Operator app, Today: jobs today, messages to reply to, bookings needing a driver, and drivers on shift",
      },
      {
        src: opBookings,
        title: "Bookings",
        caption: "Every job with its driver, price and status, as a list, calendar or board.",
        alt: "Operator app, Bookings: upcoming transfers by day, each with pickup, drop-off, price, driver and status",
      },
      {
        src: opJob,
        title: "Job detail",
        caption: "Call or WhatsApp the customer, edit the job or add the return.",
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
        caption: "Upcoming work for today, tomorrow or the week, with payment status.",
        alt: "Driver app, Jobs: upcoming transfers with times, routes, references and payment status",
      },
      {
        src: drJob,
        title: "On the job",
        caption: "Flight details, one-tap directions and the passenger a tap away.",
        alt: "Driver app, a job: passenger contact, route with directions, and the verified flight's arrival time",
      },
      {
        src: drCalendar,
        title: "Calendar",
        caption: "The month's jobs and earnings in one view.",
        alt: "Driver app, Calendar: jobs and earnings for the month, with the day's jobs below",
      },
    ],
  },
};

/** A tour of the operator and driver apps: pick an app, see its key screens on phones. */
export function AppTour() {
  const [app, setApp] = useState<keyof typeof APPS>("operator");
  return (
    <div className="app-tour">
      <div className="app-tour__switch" role="group" aria-label="Choose an app">
        {(Object.keys(APPS) as (keyof typeof APPS)[]).map((key) => (
          <button key={key} type="button" aria-pressed={app === key} onClick={() => setApp(key)}>
            {APPS[key].label}
          </button>
        ))}
      </div>
      <ul role="list" className="app-tour__screens" key={app} tabIndex={0} aria-label={`${APPS[app].label} screens`}>
        {APPS[app].screens.map((s, i) => (
          <li key={s.title} style={{ "--i": i } as React.CSSProperties}>
            <figure className="app-phone">
              <Image src={s.src} alt={s.alt} sizes="(min-width: 64rem) 300px, 70vw" placeholder="blur" />
            </figure>
            <h3>{s.title}</h3>
            <p>{s.caption}</p>
          </li>
        ))}
      </ul>
      <p className="app-tour__note">Screens from the live system. Customer and driver details are examples.</p>
    </div>
  );
}
