"use client";

import { useState } from "react";

/*
 * "Make it yours": a booking app the visitor restyles live, like a car configurator.
 * Pick a business, a colour and a look, and the phone redraws itself. The looks borrow
 * from booking flows we've built: EV Exec's dark, rounded one and Alex K Bells' bold,
 * square one. Every name, price and time shown is an example.
 */

const BUSINESSES = {
  transfers: "Airport transfers",
  barber: "Barber",
  coach: "PT & coaching",
} as const;
type Business = keyof typeof BUSINESSES;

// Each accent is dark or light enough for its text colour to stay readable on it.
const COLOURS = [
  { id: "champagne", label: "Champagne", value: "#d5a538", on: "#1a1305" },
  { id: "copper", label: "Copper", value: "#a8502a", on: "#ffffff" },
  { id: "green", label: "Racing green", value: "#2e6b4e", on: "#ffffff" },
  { id: "ocean", label: "Ocean", value: "#2a5fc0", on: "#ffffff" },
  { id: "plum", label: "Plum", value: "#7d3c6b", on: "#ffffff" },
  { id: "ice", label: "Ice", value: "#c9d6e3", on: "#0b1220" },
] as const;

const STYLES = {
  executive: "Executive",
  bold: "Bold",
  soft: "Soft",
} as const;
type Style = keyof typeof STYLES;

const FEATURES = [
  ["Payments", "Stripe or your provider", "M3 7h18v10H3zM3 10.5h18M7 14h3"],
  ["Secure", "Encrypted checkout", "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4"],
  ["Your terms", "Agreed at booking", "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5"],
  [
    "Your brand",
    "Logo, colours, style",
    "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1.4 1-2.4 2.4-2.4H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01",
  ],
] as const;

function Screen({ business }: { business: Business }) {
  if (business === "transfers")
    return (
      <>
        <p className="st-kicker">Step 1 of 3</p>
        <h4>Book your transfer</h4>
        <div className="st-option">
          <b>To the airport</b>
          <small>Departing · drop-off</small>
        </div>
        <div className="st-option is-on">
          <b>From the airport</b>
          <small>Landed · pick-up</small>
        </div>
        <div className="st-seg">
          <span>One way</span>
          <span className="is-on">Return</span>
        </div>
        <div className="st-line">
          <span>Manchester Airport</span>
          <b>£160</b>
        </div>
        <span className="st-btn">Continue</span>
      </>
    );
  if (business === "barber")
    return (
      <>
        <p className="st-kicker">Choose a service</p>
        <h4>Book a cut</h4>
        {[
          ["Skin fade", "30 min", "£18"],
          ["Cut & beard", "45 min", "£25"],
          ["Beard trim", "15 min", "£10"],
        ].map(([name, time, price], i) => (
          <div key={name} className={`st-line st-line--box${i === 0 ? " is-on" : ""}`}>
            <span>
              <b>{name}</b> <small>{time}</small>
            </span>
            <b>{price}</b>
          </div>
        ))}
        <div className="st-days">
          {["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"].map((d, i) => (
            <span key={d} className={i === 2 ? "is-on" : undefined}>
              {d.split(" ")[0]}
              <b>{d.split(" ")[1]}</b>
            </span>
          ))}
        </div>
        <div className="st-slots">
          {["09:30", "10:15", "11:00", "13:30", "14:15", "16:00"].map((t, i) => (
            <span key={t} className={i === 2 ? "is-on" : i === 1 ? "is-off" : undefined}>
              {t}
            </span>
          ))}
        </div>
        <span className="st-btn">Book 11:00 · £18</span>
      </>
    );
  return (
    <>
      <p className="st-kicker">Train with me</p>
      <h4>Book a session</h4>
      <div className="st-seg st-seg--3">
        <span>1:1 PT</span>
        <span className="is-on">Boxing</span>
        <span>Group</span>
      </div>
      <div className="st-line st-line--box is-on">
        <span>
          <b>Pad work</b> <small>45 min</small>
        </span>
        <b>£30</b>
      </div>
      <div className="st-days">
        {["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"].map((d, i) => (
          <span key={d} className={i === 0 ? "is-on" : undefined}>
            {d.split(" ")[0]}
            <b>{d.split(" ")[1]}</b>
          </span>
        ))}
      </div>
      <div className="st-slots">
        {["06:30", "07:15", "12:00", "17:30", "18:15", "19:00"].map((t, i) => (
          <span key={t} className={i === 4 ? "is-on" : i === 3 ? "is-off" : undefined}>
            {t}
          </span>
        ))}
      </div>
      <div className="st-pay">
        <span>Card</span>
        <span>Apple Pay</span>
        <span>Google Pay</span>
      </div>
      <span className="st-btn">Pay £30 securely</span>
    </>
  );
}

export function BookingStudio() {
  const [business, setBusiness] = useState<Business>("barber");
  const [colour, setColour] = useState<(typeof COLOURS)[number]>(COLOURS[0]);
  const [style, setStyle] = useState<Style>("executive");

  return (
    <div className="studio" data-cta-hide>
      <figure className="studio__stage">
        <div className="app-phone studio__phone" aria-hidden="true">
          <div className="studio__screen">
            <div
              className="st-ui"
              data-style={style}
              style={{ "--a": colour.value, "--on-a": colour.on } as React.CSSProperties}
            >
              <div className="st-status">
                <span>9:41</span>
                <span className="st-status__icons" />
              </div>
              <div className="st-head">
                <span className="st-logo">Y</span>
                <span>Your Business</span>
                <span className="st-menu" />
              </div>
              <div className="st-body" key={business}>
                <Screen business={business} />
              </div>
              <div className="st-tabs">
                {["Book", "Bookings", "Account"].map((t, i) => (
                  <span key={t} className={i === 0 ? "is-on" : undefined}>
                    <i />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <figcaption className="studio__label" aria-live="polite">
          {BUSINESSES[business]} · {colour.label} · {STYLES[style]}
        </figcaption>
      </figure>

      <div className="studio__controls">
        <fieldset className="studio__group">
          <legend>Business</legend>
          <div className="studio__chips">
            {(Object.keys(BUSINESSES) as Business[]).map((b) => (
              <button key={b} type="button" aria-pressed={business === b} onClick={() => setBusiness(b)}>
                {BUSINESSES[b]}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="studio__group">
          <legend>
            Colour <span>{colour.label}</span>
          </legend>
          <div className="studio__swatches">
            {COLOURS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={colour.id === c.id}
                aria-label={c.label}
                onClick={() => setColour(c)}
                style={{ "--swatch": c.value } as React.CSSProperties}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="studio__group">
          <legend>Look</legend>
          <div className="studio__chips">
            {(Object.keys(STYLES) as Style[]).map((s) => (
              <button key={s} type="button" aria-pressed={style === s} onClick={() => setStyle(s)}>
                {STYLES[s]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <ul role="list" className="studio__features">
        {FEATURES.map(([title, body, d]) => (
          <li key={title}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <b>{title}</b>
            <span>{body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
