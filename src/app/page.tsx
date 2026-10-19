import Link from "next/link";
import { CtaBand, PricingNotice } from "@/components/Blocks";
import { Faq } from "@/components/Faq";
import { HeroArt, TrustIcon } from "@/components/HeroArt";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { ScrollShot } from "@/components/interactive/ScrollShot";
import { HeroShowcase } from "@/components/interactive/HeroShowcase";
import { Tilt } from "@/components/interactive/Tilt";
import { WorkCarousel } from "@/components/interactive/WorkCarousel";
import { CARE_PLANS, PACKAGES, formatGBP, type CarePlan, type PackageId } from "@/lib/pricing";
import { projectBySlug, projects } from "@/lib/projects";
import evexecBooking from "../../public/work/evexec-booking.webp";

const evexec = projectBySlug("ev-exec")!;
const boonma = projectBySlug("boonma")!;
const fystay = projectBySlug("fystay")!;

// Only claims anyone can verify from the work itself or our published pages.
const trust: [string, string, "live" | "price" | "focus"][] = [
  ["Real projects", "Live sites and software you can visit today.", "live"],
  ["Clear pricing", "Published starting prices and a written scope.", "price"],
  ["Business focused", "Designed around enquiries, bookings and time saved.", "focus"],
];

const webBenefits = [
  ["Designed for your customers", "A bespoke design built around your brand and the people you sell to, never a reskinned template."],
  ["Fast on every phone", "Hand-built, accessible pages that load quickly and work beautifully on mobile."],
  ["Built to win enquiries", "Clear calls to action, enquiry forms, and online booking or payments where they help."],
  ["Easy to look after", "Optional content management, hosting and care, so your site stays secure and up to date."],
];

const saasBenefits = [
  ["Built around your workflow", "We learn how your team works today and design the software around it, not the other way round."],
  ["Proven in a real operation", `Our driver and operator software was developed for ${evexec.name}, a working airport transfer business.`],
  ["Products we run ourselves", "FYStay, our holiday stays platform, is designed, built and operated by FY Devs."],
  ["Scoped before you commit", "A written scope, fixed price and payment schedule before any work begins."],
];

const process = [
  ["Enquiry", "Tell us what you need using the short form or the instant estimate. We reply by email."],
  ["Discovery call", "A conversation about your goals, your customers and what success looks like."],
  ["Proposal & quote", "A written scope, fixed price, payment schedule and timeline for you to approve."],
  ["Design", "We design your key pages and refine them with you over the agreed revision rounds."],
  ["Build & test", "We build, then test on phones, tablets and desktops, with a keyboard and a screen reader."],
  ["Launch & support", "We put it live, hand everything over, and support you afterwards if you choose a care plan."],
];

const packageOrder: PackageId[] = ["essential", "professional", "premium"];
const packagePages: Record<PackageId, string> = { essential: "1-5", professional: "6-12", premium: "13-25" };
const planOrder: CarePlan[] = ["hosting", "care", "carePlus"];

export default function HomePage() {
  return (
    <>
      {/* Hero: what we build, with real work alongside */}
      <section className="hx" aria-labelledby="hero-title">
        <HeroArt />
        <div className="container container--wide hx__grid">
          <div className="hx__copy">
            <p className="hx__eyebrow rise">
              <span>Modern websites</span>
              <span>Scalable SaaS</span>
              <span>Booking software</span>
            </p>
            <h1 id="hero-title" className="hx__title rise" style={{ "--i": 1 } as React.CSSProperties}>
              Websites and software that <span className="serif-em">move you forward.</span>
            </h1>
            <p className="hx__lede rise" style={{ "--i": 2 } as React.CSSProperties}>
              We design and build high-performing websites, SaaS platforms and booking software that help modern
              businesses grow.
            </p>
            <div className="btn-row rise" style={{ "--i": 3 } as React.CSSProperties}>
              <Link href="/contact?topic=website" className="btn btn--primary">
                Start a project
                <ArrowUpRight />
              </Link>
              <Link href="/work" className="btn btn--secondary">
                Explore our work
              </Link>
            </div>
          </div>

          <div className="hx__show rise" style={{ "--i": 2 } as React.CSSProperties}>
            <HeroShowcase
              items={projects}
              software={{
                name: evexec.name,
                category: "Booking software",
                url: evexec.url,
                host: evexec.host,
                image: evexecBooking,
                alt: "The EV Exec online booking flow, step one: choose your journey",
              }}
            />
          </div>

          <ul role="list" className="hx__trust rise" style={{ "--i": 4 } as React.CSSProperties}>
            {trust.map(([title, body, icon]) => (
              <li key={title}>
                <TrustIcon name={icon} />
                <div>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Proof: facts anyone can check */}
      <section className="proof" aria-label="At a glance">
        <div className="container container--wide">
          <ul role="list" className="proof__list">
            <li>
              <strong>4</strong>
              <span>live projects you can visit</span>
            </li>
            <li>
              <strong>{formatGBP(PACKAGES.essential.from)}</strong>
              <span>websites from, prices published</span>
            </li>
            <li>
              <strong>0</strong>
              <span>templates, every design is bespoke</span>
            </li>
            <li>
              <strong>2</strong>
              <span>software products designed and built</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Web design */}
      <section id="web-design" className="section" aria-labelledby="web-title">
        <div className="container container--wide split split--media-wide service-split">
          <div className="stack" style={{ "--stack": "var(--space-5)" } as React.CSSProperties} data-reveal>
            <p className="eyebrow eyebrow--num">Web design & development</p>
            <h2 id="web-title" className="h2">
              A website that brings you customers.
            </h2>
            <p className="lede">
              Bespoke websites designed around your brand and built to turn visitors into enquiries, bookings and
              sales.
            </p>
            <ul role="list" className="benefits">
              {webBenefits.map(([title, body]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row">
              <Link href="/contact?topic=website" className="btn btn--primary">
                Start a Project
                <ArrowRight />
              </Link>
              <Link href="#pricing" className="btn btn--secondary">
                See prices
              </Link>
            </div>
          </div>
          <div data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            <Tilt max={4}>
              <Link href="/work#boonma" className="media-panel scroll-trigger" style={{ display: "block" }}>
                <ScrollShot
                  src={boonma.page}
                  host={boonma.host}
                  alt="The Boonma website, designed and built by FY Devs"
                  sizes="(min-width: 64rem) 640px, 90vw"
                />
              </Link>
            </Tilt>
            <p className="media-caption">
              Boonma, a client website. <span className="on-hover">Hover to scroll the full page.</span>
              <span className="on-touch">Scrolling the full page.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SaaS */}
      <section id="saas" className="section inverse" aria-labelledby="saas-title">
        <div className="container container--wide split split--media-wide service-split">
          <div className="stack" style={{ "--stack": "var(--space-5)" } as React.CSSProperties} data-reveal>
            <p className="eyebrow eyebrow--num">SaaS & software development</p>
            <h2 id="saas-title" className="h2">
              Software that runs your business.
            </h2>
            <p className="lede">
              Booking systems, customer portals and web applications built around how you work. We run software of
              our own, so we know what it takes.
            </p>
            <ul role="list" className="benefits">
              {saasBenefits.map(([title, body]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row">
              <Link href="/contact?topic=bespoke" className="btn btn--primary">
                Build My SaaS
                <ArrowRight />
              </Link>
              <Link href="/booking-software" className="btn btn--secondary">
                Booking software demo
              </Link>
            </div>
          </div>
          <div data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            <Tilt max={4}>
              <Link href="/work#fystay" className="media-panel scroll-trigger" style={{ display: "block" }}>
                <ScrollShot
                  src={fystay.page}
                  host={fystay.host}
                  alt="FYStay, the holiday stays platform built and run by FY Devs"
                  sizes="(min-width: 64rem) 640px, 90vw"
                />
              </Link>
            </Tilt>
            <p className="media-caption">
              FYStay, our own platform. <span className="on-hover">Hover to scroll the full page.</span>
              <span className="on-touch">Scrolling the full page.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="section" aria-labelledby="work-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Case studies</p>
              <h2 id="work-title" className="h2">
                Real projects, live today.
              </h2>
            </div>
            <div className="stack" style={{ "--stack": "var(--space-4)" } as React.CSSProperties}>
              <p className="muted">
                Three client websites and our own platform. Swipe through, then read the challenge, our solution and
                what we built for each.
              </p>
              <p>
                <Link href="/work" className="arrow-link">
                  Read the case studies <ArrowRight />
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div data-reveal>
          <WorkCarousel items={projects} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section section--ruled" aria-labelledby="pricing-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Pricing</p>
              <h2 id="pricing-title" className="h2">
                Clear starting prices.
              </h2>
            </div>
            <p className="muted">
              Every website is bespoke, so these are starting points. Your exact price is confirmed in writing before
              you commit.
            </p>
          </div>

          <div className="plans">
            {packageOrder.map((id, i) => {
              const pkg = PACKAGES[id];
              return (
                <article
                  key={id}
                  className={`plan${id === "professional" ? " plan--featured" : ""}`}
                  data-reveal
                  style={{ "--d": i } as React.CSSProperties}
                >
                  <h3 className="plan__name">{pkg.name}</h3>
                  <p className="plan__summary">{pkg.summary}</p>
                  <p className="plan__price">
                    <span>from</span> {formatGBP(pkg.from)}
                  </p>
                  <ul role="list" className="checks">
                    {pkg.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/build?pages=${packagePages[id]}`}
                    className={`btn ${id === "professional" ? "btn--primary" : "btn--secondary"} plan__cta`}
                  >
                    Start a Project
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="plan-wide" data-reveal>
            <div>
              <h3 className="plan__name">SaaS & bespoke software</h3>
              <p className="plan__summary">
                Priced after a scoping conversation. You receive a written scope, fixed price and payment schedule
                before any commitment.
              </p>
            </div>
            <p className="plan__price">Custom quote</p>
            <Link href="/contact?topic=bespoke" className="btn btn--primary">
              Build My SaaS
            </Link>
          </div>

          <div className="mt-6">
            <PricingNotice />
          </div>

          {/* Ongoing services */}
          <div id="ongoing" className="ongoing" data-reveal>
            <div className="ongoing__intro">
              <h3 className="h3">After launch: hosting, care and future development</h3>
              <p className="muted small">
                Monthly plans are optional and always priced separately from your build. New features and larger
                improvements are quoted as separate work, or covered by the hours in Care Plus.
              </p>
            </div>
            <ul role="list" className="ongoing__plans">
              {planOrder.map((id) => {
                const plan = CARE_PLANS[id];
                return (
                  <li key={id}>
                    <p className="ongoing__name">
                      {plan.label}
                      <span>{formatGBP(plan.monthly)}/mo</span>
                    </p>
                    <ul role="list" className="checks">
                      {plan.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section" aria-labelledby="process-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Process</p>
              <h2 id="process-title" className="h2">
                From first message to launch.
              </h2>
            </div>
            <p className="muted">
              Six clear stages, with nothing to pay until you&apos;ve approved a written scope and price.
            </p>
          </div>
          <ol role="list" className="steps">
            {process.map(([title, body], i) => (
              <li key={title} data-reveal style={{ "--d": i } as React.CSSProperties}>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section--ruled" aria-labelledby="faq-title">
        <div className="container container--wide faq-layout">
          <div className="section-head" data-reveal>
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title" className="h2">
              Questions, answered.
            </h2>
            <p className="muted">
              Anything else? <Link href="/contact?topic=other">Ask us directly</Link>.
            </p>
          </div>
          <div data-reveal>
            <Faq />
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to start?"
        body="Tell us your goals, budget and timeline. We'll reply with honest advice and a clear next step."
      >
        <Link href="/contact?topic=website" className="btn btn--primary">
          Start a Project
        </Link>
        <Link href="/contact?topic=bespoke" className="btn btn--secondary">
          Build My SaaS
        </Link>
      </CtaBand>
    </>
  );
}
