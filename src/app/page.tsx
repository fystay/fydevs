import Image from "next/image";
import Link from "next/link";
import { ArrowLink, CtaBand, PricingNotice } from "@/components/Blocks";
import { BrowserFrame, PhoneFrame } from "@/components/Devices";
import { ArrowRight } from "@/components/Icons";
import { QuickEstimate } from "@/components/estimate/QuickEstimate";
import { PACKAGES, formatGBP, type PackageId } from "@/lib/pricing";
import { projectBySlug, projects } from "@/lib/projects";

const evexec = projectBySlug("ev-exec")!;
const boonma = projectBySlug("boonma")!;
const alex = projectBySlug("alex-k-bells")!;
const fystay = projectBySlug("fystay")!;

const websiteServices = [
  ["Design", "A visual identity for the web, built from your brand and your customers."],
  ["Development", "Fast, accessible, hand-built sites that are easy to maintain."],
  ["Booking & payments", "Online booking, quotes and payments where they earn their place."],
  ["Hosting & care", "Optional hosting and maintenance, priced separately and clearly."],
];

const softwareServices = [
  ["Booking software", "Driver and operator tools, developed for a working transfer business."],
  ["Platforms", "Products like FYStay, which we design, build and run ourselves."],
  ["Bespoke systems", "Custom booking platforms, integrations and internal tools."],
  ["Integrations", "Connecting the services you already use, so data moves without retyping."],
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
      {/* Hero: a typographic statement over real work */}
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

      <section aria-label="Recent work" className="container container--wide">
        <div className="stage">
          <BrowserFrame
            className="stage__browser"
            src={evexec.desktop}
            host={evexec.host}
            alt={`The ${evexec.name} website: premium airport transfers and private hire`}
            sizes="(min-width: 80rem) 960px, 80vw"
            preload
          />
          <PhoneFrame
            className="stage__phone stage__phone--a"
            src={boonma.mobile}
            alt={`The ${boonma.name} website on a phone`}
            sizes="(min-width: 48rem) 230px, 28vw"
          />
          <PhoneFrame
            className="stage__phone stage__phone--b"
            src={alex.mobile}
            alt={`The ${alex.name} website on a phone`}
            sizes="(min-width: 48rem) 200px, 25vw"
          />
        </div>
        <div className="stage-caption">
          <p>Fig. 01 — Recent work, each designed and built from scratch</p>
          <ul role="list">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work#${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Selected work: an editorial index */}
      <section className="section" aria-labelledby="work-title">
        <div className="container container--wide">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="eyebrow">Selected work</p>
              <h2 id="work-title" className="h2">
                Built for four very different businesses.
              </h2>
            </div>
            <p className="muted">
              A transfer company, a massage studio, a coach and our own holiday platform. None of them share a
              template, because none of them share customers.
            </p>
          </div>
          <ol role="list" className="work-index">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work#${p.slug}`} className="work-index__row">
                  <span className="work-index__thumb">
                    <Image src={p.mobile} alt="" sizes="96px" />
                  </span>
                  <span className="work-index__name">{p.name}</span>
                  <span className="work-index__meta">
                    {p.sector}
                    <span>{p.location}</span>
                  </span>
                  <span className="work-index__go" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            <ArrowLink href="/work">See every project in detail</ArrowLink>
          </p>
        </div>
      </section>

      {/* Services: two halves of the business */}
      <section className="section section--ruled" aria-labelledby="services-title">
        <div className="container container--wide">
          <div className="section-head">
            <p className="eyebrow">What we do</p>
            <h2 id="services-title" className="h2">
              Websites, and the software behind them.
            </h2>
          </div>
          <div className="service-index">
            <div className="service-index__col">
              <header>
                <h3 className="h3">Websites</h3>
                <p className="muted small">Bespoke design and development, with prices you can see up front.</p>
              </header>
              <ul role="list">
                {websiteServices.map(([title, body]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5">
                <ArrowLink href="/websites">Services and packages</ArrowLink>
              </p>
            </div>
            <div className="service-index__col">
              <header>
                <h3 className="h3">Software & systems</h3>
                <p className="muted small">Practical tools built around how a business actually operates.</p>
              </header>
              <ul role="list">
                {softwareServices.map(([title, body]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5">
                <ArrowLink href="/bespoke-systems">Bespoke systems</ArrowLink>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Software: dark product band */}
      <section className="section inverse product-band" aria-labelledby="software-title">
        <div className="container container--wide product-band__grid">
          <div className="stack" style={{ "--stack": "var(--space-6)" } as React.CSSProperties}>
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
          <div className="media-panel">
            <BrowserFrame
              src={fystay.desktop}
              host={fystay.host}
              alt="The FYStay holiday stays platform, showing a stay search for Blackpool"
              sizes="(min-width: 64rem) 640px, 90vw"
            />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section" aria-labelledby="approach-title">
        <div className="container container--wide">
          <div className="section-head section-head--split">
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
          <ol role="list" className="ruled-list">
            {steps.map(([title, body], i) => (
              <li key={title}>
                <span className="ruled-list__num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{title}</h3>
                <p className="muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="section section--ruled" aria-labelledby="pricing-title">
        <div className="container container--wide">
          <div className="section-head">
            <p className="eyebrow">Pricing</p>
            <h2 id="pricing-title" className="h2">
              Clear prices, before any call.
            </h2>
          </div>
          <div className="pricing-split">
            <div>
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
            <QuickEstimate />
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
