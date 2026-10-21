"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Bespoke, shown: one website on a screen and a phone, redrawn for each business the
 * visitor picks (tap a chip or swipe the picture). While it's on screen it cycles on its
 * own until the visitor takes over. Every business, name and line shown is an example.
 */

const SITES = [
  {
    id: "cafe",
    kind: "Café",
    name: "Oak & Ember",
    host: "oakandember.co.uk",
    title: "Wood-fired, all day.",
    line: "Breakfast till late, in the heart of Leeds.",
    cta: "Book a table",
    nav: ["Menu", "Visit", "Events"],
    cards: ["Sourdough", "Small plates", "Natural wine"],
  },
  {
    id: "salon",
    kind: "Salon",
    name: "Bloom Studio",
    host: "bloomstudio.co.uk",
    title: "Hair that feels like you.",
    line: "Cuts, colour and care in Chester.",
    cta: "Book an appointment",
    nav: ["Services", "Team", "Prices"],
    cards: ["Cut & finish", "Balayage", "Treatments"],
  },
  {
    id: "trades",
    kind: "Electrician",
    name: "Spark & Co",
    host: "sparkandco.co.uk",
    title: "Safe. Certified. On time.",
    line: "Electricians across Greater Manchester.",
    cta: "Get a free quote",
    nav: ["Services", "Areas", "Reviews"],
    cards: ["Rewires", "EV chargers", "Testing"],
  },
  {
    id: "clinic",
    kind: "Physio",
    name: "Calm Physio",
    host: "calmphysio.co.uk",
    title: "Move freely again.",
    line: "Same-week physiotherapy in Bristol.",
    cta: "Book online",
    nav: ["Treatments", "About", "Fees"],
    cards: ["Back & neck", "Sports injury", "Pilates"],
  },
] as const;

type Site = (typeof SITES)[number];

function Desktop({ site }: { site: Site }) {
  return (
    <div className="ss-site" key={site.id}>
      <div className="ss-nav">
        <b className="ss-logo">{site.name}</b>
        {site.nav.map((n) => (
          <span key={n}>{n}</span>
        ))}
        <span className="ss-btn ss-btn--sm">{site.cta}</span>
      </div>
      <div className="ss-hero">
        <div>
          <b className="ss-title">{site.title}</b>
          <span className="ss-line">{site.line}</span>
          <span className="ss-btn">{site.cta}</span>
        </div>
        <i className="ss-photo" />
      </div>
      <div className="ss-cards">
        {site.cards.map((c) => (
          <span key={c}>
            <i className="ss-photo" />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function Mobile({ site }: { site: Site }) {
  return (
    <div className="ss-site" key={site.id}>
      <div className="ss-nav">
        <b className="ss-logo">{site.name}</b>
        <i className="ss-menu" />
      </div>
      <i className="ss-photo" />
      <b className="ss-title">{site.title}</b>
      <span className="ss-line">{site.line}</span>
      <span className="ss-btn">{site.cta}</span>
      <div className="ss-cards">
        {site.cards.slice(0, 2).map((c) => (
          <span key={c}>
            <i className="ss-photo" />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteStyler() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const site = SITES[i];

  const pick = (n: number) => {
    setAuto(false);
    setI((n + SITES.length) % SITES.length);
  };

  // Cycle through the businesses while the picture is on screen, until the visitor takes over.
  useEffect(() => {
    const el = root.current;
    if (!el || !auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(timer);
        if (e.isIntersecting) timer = window.setInterval(() => setI((n) => (n + 1) % SITES.length), 3200);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [auto]);

  return (
    <div className="ss" data-site={site.id} ref={root}>
      <div
        className="ss-duo"
        aria-hidden="true"
        onPointerDown={(e) => (start.current = e.clientX)}
        onPointerUp={(e) => {
          const dx = start.current === null ? 0 : e.clientX - start.current;
          start.current = null;
          if (Math.abs(dx) > 40) pick(i + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="ss-screen">
          <div className="ss-url">{site.host}</div>
          <div className="ss-view ss-view--desktop">
            <Desktop site={site} />
          </div>
        </div>
        <div className="app-phone ss-phone">
          <div className="ss-view ss-view--mobile">
            <Mobile site={site} />
          </div>
        </div>
      </div>
      <fieldset className="ss-pick">
        <legend className="visually-hidden">See the website styled for</legend>
        <div className="studio__chips">
          {SITES.map((s, n) => (
            <button key={s.id} type="button" aria-pressed={n === i} onClick={() => pick(n)}>
              {s.kind}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
