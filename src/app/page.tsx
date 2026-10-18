import Link from "next/link";
import { ArrowLink, CtaBand, PricingNotice } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { QuickEstimate } from "@/components/estimate/QuickEstimate";
import { HoverList, type HoverItem } from "@/components/interactive/HoverList";
import { ScrollShot } from "@/components/interactive/ScrollShot";
import { ShowcaseStage } from "@/components/interactive/ShowcaseStage";
import { Tilt } from "@/components/interactive/Tilt";
import { WorkCarousel } from "@/components/interactive/WorkCarousel";
import { PACKAGES, formatGBP, type PackageId } from "@/lib/pricing";
import { projectBySlug, projects } from "@/lib/projects";
import evexecBooking from "../../public/work/evexec-booking.webp";

const evexec = projectBySlug("ev-exec")!;
const boonma = projectBySlug("boonma")!;
const alex = projectBySlug("alex-k-bells")!;
const fystay = projectBySlug("fystay")!;

const services: HoverItem[] = [
  {
    title: "Bespoke websites",
    body: "Designed and hand-built around your brand, fast and accessible by default.",
    href: "/websites",
    image: boonma.desktop,
    caption: "Boonma / boonma.vercel.app",
  },
  {
    title: "Identity for the web",
    body: "Type, colour and layout chosen for your customers, not a theme.",
    href: "/work#alex-k-bells",
    image: alex.desktop,
    caption: "Alex K Bells / alexkbells.vercel.app",
  },
  {
    title: "Online booking",
    body: "Quotes, bookings and payments built into the site where they earn their place.",
    href: "/websites",
    image: evexecBooking,
    caption: "EV Exec / three-step booking",
  },
  {
    title: "Booking software",
    body: "Driver and operator applications, developed for a working transfer business.",
    href: "/booking-software",
    image: evexec.desktop,
    caption: "EV Exec / evexec.co.uk",
  },
  {
    title: "Platforms",
    body: "Products like FYStay, which we design, build and run ourselves.",
    href: "/work#fystay",
    image: fystay.desktop,
    caption: "FYStay / fystay.co.uk",
  },
  {
    title: "Bespoke systems",
    body: "Custom booking platforms, integrations and internal tools.",
    href: "/bespoke-systems",
    image: fystay.mobile,
    caption: "FYStay / stay search on mobile",
  },
];

const steps = [
  ["Configure", "Answer a few questions and see an indicative price in minutes."],
  ["Confirm scope", "We agree deliverables, assumptions and the price in writing."],
  ["Design", "A visual direction built around your brand, refined over agreed rounds."],
  ["Build & test", "Responsive development, tested across devices, browsers and keyboards."],
  ["Launch & care", "We put it live and, if you choose, look after it afterwards."],
];

const packageOrder: PackageId[] = ["essential", "professional", "premium"];

export default function HomePage() {
  return (
    <>
      {/* Hero: a typographic statement over real, interactive work */}
      <section className="hero-ed">
        <div className="container container--wide">
          <ul role="list" className="hero-meta rise">
            <li>Websites</li>
            <li>Booking software</li>
            <li>Bespoke systems</li>
          </ul>
          <div className="hero-ed__grid">
            <h1 className="display rise">
              Digital experiences, <span className="serif-em">built with intent.</span>
            </h1>
            <div className="hero-ed__aside rise" style={{ "--i": 1 } as React.CSSProperties}>
              <p className="lede">
                FY Devs is an independent studio designing and building bespoke websites, booking software and
                digital systems for businesses that care how they work and how they&apos;re seen.
              </p>
              <div className="btn-row">
                <Link href="/build" className="btn btn--primary">
                  Build your website
                  <ArrowRight />
                </Link>
                <Link href="/work" className="btn btn--secondary">
                  See our work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Recent work" className="container container--wide rise" style={{ "--i": 2 } as React.CSSProperties}>
        <ShowcaseStage items={projects} />
      </section>

      {/* Selected work: a swipeable, full-bleed carousel */}
      <section className="section" aria-labelledby="work-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Selected work</p>
              <h2 id="work-title" className="h2">
                Built for four very different businesses.
              </h2>
            </div>
            <p className="muted">
              A transfer company, a massage studio, a coach and our own holiday platform, none of them sharing a
              template. Swipe through, and watch each site scroll.
            </p>
          </div>
        </div>
        <div data-reveal>
          <WorkCarousel items={projects} />
        </div>
      </section>

      {/* Services: hover rows with live previews */}
      <section className="section section--ruled" aria-labelledby="services-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">What we do</p>
              <h2 id="services-title" className="h2">
                Websites, and the software behind them.
              </h2>
            </div>
            <p className="muted">From a polished marketing site to the systems a business runs on each day.</p>
          </div>
          <div data-reveal>
            <HoverList items={services} />
          </div>
        </div>
      </section>

      {/* Software: dark product band */}
      <section className="section inverse product-band" aria-labelledby="software-title">
        <div className="container container--wide product-band__grid">
          <div className="stack" style={{ "--stack": "var(--space-6)" } as React.CSSProperties} data-reveal>
            <p className="eyebrow eyebrow--num">Software</p>
            <h2 id="software-title" className="h2">
              Software that runs real operations.
            </h2>
            <p className="lede">
              Our booking software was developed for {evexec.name}, a working airport transfer business. FYStay is
              our own platform for holiday stays on the Fylde Coast.
            </p>
            <ul role="list" className="product-list">
              <li>
                <Link href="/booking-software">
                  <strong>Booking software</strong>
                  <span>Driver and operator applications for taxi and transfer firms.</span>
                  <ArrowRight size={18} />
                </Link>
              </li>
              <li>
                <Link href="/work#fystay">
                  <strong>FYStay</strong>
                  <span>Holiday homes and guest houses from local Fylde Coast hosts.</span>
                  <ArrowRight size={18} />
                </Link>
              </li>
              <li>
                <Link href="/bespoke-systems">
                  <strong>Bespoke systems</strong>
                  <span>Booking platforms and tools shaped around your operation.</span>
                  <ArrowRight size={18} />
                </Link>
              </li>
            </ul>
          </div>
          <div data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            <Tilt max={4}>
              <a
                href={fystay.url}
                target="_blank"
                rel="noopener noreferrer"
                className="media-panel scroll-trigger"
                style={{ display: "block" }}
              >
                <ScrollShot
                  src={fystay.page}
                  host={fystay.host}
                  alt="The FYStay holiday stays platform. Hover to scroll the page."
                  sizes="(min-width: 64rem) 640px, 90vw"
                />
                <span className="visually-hidden">Visit fystay.co.uk (opens in a new tab)</span>
              </a>
            </Tilt>
            <p className="media-caption">Fig. 02 — FYStay. Hover to scroll the live page.</p>
          </div>
        </div>
      </section>

      {/* Approach: a sequence of steps */}
      <section className="section" aria-labelledby="approach-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Approach</p>
              <h2 id="approach-title" className="h2">
                How a project runs.
              </h2>
            </div>
            <p className="muted">
              Agency projects are often slow to quote and vague about cost. We work the other way round: clear
              choices, visible prices and a scope agreed in writing before any commitment.
            </p>
          </div>
          <ol role="list" className="steps">
            {steps.map(([title, body], i) => (
              <li key={title} data-reveal style={{ "--d": i } as React.CSSProperties}>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="section section--ruled" aria-labelledby="pricing-title">
        <div className="container container--wide">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Pricing</p>
            <h2 id="pricing-title" className="h2">
              Clear prices, before any call.
            </h2>
          </div>
          <div className="pricing-split">
            <div data-reveal>
              <ul role="list" className="price-rows">
                {packageOrder.map((id) => {
                  const pkg = PACKAGES[id];
                  return (
                    <li key={id}>
                      <h3>{pkg.name}</h3>
                      <span className="price">
                        <small>from</small>
                        {formatGBP(pkg.from)}
                      </span>
                      <p>
                        {pkg.summary} {pkg.includes[0]}.
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6" style={{ display: "grid", gap: "var(--space-5)" }}>
                <PricingNotice />
                <p>
                  <ArrowLink href="/websites#packages">Compare packages in full</ArrowLink>
                </p>
              </div>
            </div>
            <div data-reveal style={{ "--d": 2 } as React.CSSProperties}>
              <QuickEstimate />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Tell us what you're building."
        body="Configure a website for an instant estimate, or tell us about software and bespoke systems."
      >
        <Link href="/build" className="btn btn--primary">
          Build your website
        </Link>
        <Link href="/contact" className="btn btn--secondary">
          Get in touch
        </Link>
      </CtaBand>
    </>
  );
}
