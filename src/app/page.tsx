import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PricingNotice } from "@/components/Blocks";
import { Faq } from "@/components/Faq";
import { ServiceSwitcher } from "@/components/ServiceSwitcher";
import { ArrowRight } from "@/components/Icons";
import { ScrollShot } from "@/components/interactive/ScrollShot";
import { ShowcaseStage } from "@/components/interactive/ShowcaseStage";
import { Tilt } from "@/components/interactive/Tilt";
import { PlanSwiper, type PlanCard } from "@/components/interactive/PlanSwiper";
import { WorkCarousel } from "@/components/interactive/WorkCarousel";
import { PACKAGES, formatGBP, type PackageId } from "@/lib/pricing";
import { carePlanCards } from "@/lib/plans";
import { projectBySlug, projects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";
import workspace from "../../public/hero/fydevs-workspace.webp";


// Title, description and share image come from the root layout; only the canonical URL is added here.
export const metadata: Metadata = siteUrl() ? { alternates: { canonical: "/" } } : {};

const evexec = projectBySlug("ev-exec")!;
const boonma = projectBySlug("boonma")!;
const fystay = projectBySlug("fystay")!;

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

const plans: PlanCard[] = [
  ...packageOrder.map((id): PlanCard => ({
    id,
    name: PACKAGES[id].name,
    summary: PACKAGES[id].summary,
    price: formatGBP(PACKAGES[id].from),
    from: true,
    includes: PACKAGES[id].includes,
    href: `/build?pages=${packagePages[id]}`,
    cta: "Start a Project",
  })),
  {
    id: "saas",
    name: "SaaS & bespoke software",
    summary:
      "Priced after a scoping conversation, with everything agreed in writing before any commitment.",
    price: "Custom quote",
    includes: [
      "Booking systems, customer portals and web applications",
      "Discovery call and written scope",
      "Fixed price and payment schedule",
      "Working software delivered in agreed stages",
    ],
    href: "/contact?topic=bespoke",
    cta: "Build My SaaS",
    variant: "inverse",
  },
];


export default function HomePage() {
  return (
    <>
      {/* Hero: the message on the left, the studio desk (with our real work on screen) on the right */}
      <section className="hero-ed" data-nav="/work" aria-labelledby="hero-title">
        <div className="hero-ed__visual">
          <Image
            src={workspace}
            alt="A FY Devs desk: a laptop showing our portfolio of EV Exec, Boonma, FYStay and Alex K Bells, beside a FY Devs mug, notebook and business cards."
            sizes="(min-width: 64rem) 75vw, 100vw"
            placeholder="blur"
            preload
            className="hero-ed__photo"
          />
        </div>
        <div className="container container--wide hero-ed__layout">
          <div className="hero-ed__copy">
            <ServiceSwitcher current="web" />
            <h1 id="hero-title" className="hero-ed__title rise" style={{ "--i": 1 } as React.CSSProperties}>
              Websites{" "}
              <br />
              and software{" "}
              <span className="serif-em">
                that grow{" "}
                <br />
                your business.
              </span>
            </h1>
            <p className="lede rise" style={{ "--i": 2 } as React.CSSProperties}>
              We design bespoke, mobile-first websites that turn visitors into enquiries, and build SaaS and booking
              software that saves your team time. Published prices, no templates, and real work you can visit.
            </p>
            <div className="btn-row rise" style={{ "--i": 3 } as React.CSSProperties}>
              <Link href="/contact?topic=website" className="btn btn--primary">
                Start a Project
                <ArrowRight />
              </Link>
              <Link href="/contact?topic=bespoke" className="btn btn--secondary">
                Build My SaaS
              </Link>
            </div>
            <div className="hero-ed__links rise" style={{ "--i": 4 } as React.CSSProperties}>
              <Link href="/work" className="circle-link">
                <span className="circle-link__icon" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
                View our work
              </Link>
              <p className="hero-note">
                Or <Link href="/build">get an instant website estimate</Link> in two minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Recent work" data-nav="/work" className="container container--wide showcase-section">
        <ShowcaseStage items={projects} />
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
      <section id="web-design" data-nav="/websites" className="section" aria-labelledby="web-title">
        <div className="container container--wide split split--media-wide service-split">
          <div className="stack" style={{ "--stack": "var(--space-5)" } as React.CSSProperties} data-reveal>
            <p className="eyebrow eyebrow--num">Web design & development</p>
            <h2 id="web-title" className="h2">
              A website that brings{" "}
              <span className="serif-em">you customers.</span>
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
      <section id="saas" data-nav="/bespoke-systems" className="section inverse" aria-labelledby="saas-title">
        <div className="container container--wide split split--media-wide service-split">
          <div className="stack" style={{ "--stack": "var(--space-5)" } as React.CSSProperties} data-reveal>
            <p className="eyebrow eyebrow--num">SaaS & software development</p>
            <h2 id="saas-title" className="h2">
              Software that runs <span className="serif-em">your business.</span>
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
      <section className="section" data-nav="/work" aria-labelledby="work-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Case studies</p>
              <h2 id="work-title" className="h2">
                Real projects, <span className="serif-em">live today.</span>
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
      <section id="pricing" data-nav="/websites" className="section section--ruled" aria-labelledby="pricing-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Pricing</p>
              <h2 id="pricing-title" className="h2">
                Clear <span className="serif-em">starting prices.</span>
              </h2>
            </div>
            <p className="muted">
              Every website is bespoke, so these are starting points. Your exact price is confirmed in writing before
              you commit.
            </p>
          </div>
        </div>

        <div data-reveal>
          <PlanSwiper plans={plans} initial="professional" label="Starting prices" />
        </div>

        <div className="container container--wide">
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
          </div>
        </div>

        <div data-reveal>
          <PlanSwiper plans={carePlanCards} initial="care" label="Hosting and care plans" />
        </div>
      </section>

      {/* Process */}
      <section id="process" data-nav="/about" className="section" aria-labelledby="process-title">
        <div className="container container--wide">
          <div className="section-head section-head--split" data-reveal>
            <div className="stack">
              <p className="eyebrow">Process</p>
              <h2 id="process-title" className="h2">
                From first message <span className="serif-em">to launch.</span>
              </h2>
            </div>
            <p className="muted">
              Six clear stages, with nothing to pay until you&apos;ve approved a written scope and price.
            </p>
          </div>
          <ol role="list" className="steps" aria-label="Our process, step by step" tabIndex={0}>
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
      <section id="faq" data-nav="/about" className="section section--ruled" aria-labelledby="faq-title">
        <div className="container container--wide faq-layout">
          <div className="section-head" data-reveal>
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title" className="h2">
              Questions, <span className="serif-em">answered.</span>
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
