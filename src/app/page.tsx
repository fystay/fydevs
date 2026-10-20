import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PricingNotice } from "@/components/Blocks";
import { Faq } from "@/components/Faq";
import { ServiceSwitcher } from "@/components/ServiceSwitcher";
import { ArrowRight } from "@/components/Icons";
import { ScrollShot } from "@/components/interactive/ScrollShot";
import { LaptopZoom, type ScreenQuad } from "@/components/interactive/LaptopZoom";
import { ShowcaseStage } from "@/components/interactive/ShowcaseStage";
import { Tilt } from "@/components/interactive/Tilt";
import { PlanSwiper, type PlanCard } from "@/components/interactive/PlanSwiper";
import { PACKAGES, formatGBP, type PackageId } from "@/lib/pricing";
import { carePlanCards } from "@/lib/plans";
import { projectBySlug, projects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";
import workspace from "../../public/hero/fydevs-workspace.webp";

// Title, description and share image come from the root layout; only the canonical URL is added here.
export const metadata: Metadata = siteUrl() ? { alternates: { canonical: "/" } } : {};

// Where the laptop screen sits in the hero photo, in image pixels (it runs off the photo's right edge).
const LAPTOP_SCREEN: ScreenQuad = [
  [603, 548],
  [1060, 510],
  [1118, 1006],
  [672, 1062],
];

const evexec = projectBySlug("ev-exec")!;
const boonma = projectBySlug("boonma")!;
const fystay = projectBySlug("fystay")!;

// Short on purpose: the visuals do the selling; the detail lives on the service pages.
const webBenefits = [
  "Designed for your customers",
  "Fast on every phone",
  "Built to win enquiries",
  "Easy to look after",
];

const saasBenefits = [
  "Built around your workflow",
  `Proven at ${evexec.name}, a working transfer business`,
  "Fixed price, delivered in stages",
  "Scoped before you commit",
];

const process = [
  ["Enquiry", "Short form or instant estimate."],
  ["Discovery call", "Your goals and your customers."],
  ["Proposal & quote", "Written scope and fixed price."],
  ["Design", "Key pages, refined with you."],
  ["Build & test", "Every device, fully accessible."],
  ["Launch & support", "Live, handed over, supported."],
];

/*
 * The homepage shows the points that tell the plans apart, taken word for word from each
 * plan's full list; every inclusion is on /websites.
 */
const packageHighlights: Record<PackageId, string[]> = {
  essential: ["Up to 5 pages", "Enquiry form", "Two rounds of design revisions"],
  professional: ["Up to 12 pages", "Content management", "Three rounds of design revisions"],
  premium: ["Up to 25 pages", "Extensive custom design and interaction", "Launch and 60 days of handover support"],
};
const careHighlights = 3;

const packageOrder: PackageId[] = ["essential", "professional", "premium"];
const packagePages: Record<PackageId, string> = { essential: "1-5", professional: "6-12", premium: "13-25" };

const plans: PlanCard[] = [
  ...packageOrder.map(
    (id): PlanCard => ({
      id,
      name: PACKAGES[id].name,
      summary: PACKAGES[id].summary,
      price: formatGBP(PACKAGES[id].from),
      from: true,
      includes: PACKAGES[id].includes.filter((item) => packageHighlights[id].includes(item)),
      href: `/build?pages=${packagePages[id]}`,
      cta: "Start a Project",
    }),
  ),
  {
    id: "saas",
    name: "SaaS & bespoke software",
    summary: "Booking systems, customer portals and web applications.",
    price: "Custom quote",
    includes: [
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
      {/*
        Hero: the message on the left, the studio desk (with our real work on screen) on the right.
        Scrolling zooms into the laptop, whose screen becomes the project showcase.
      */}
      <LaptopZoom
        screen={LAPTOP_SCREEN}
        hero={
          <section className="hero-ed" data-nav="/work" aria-labelledby="hero-title">
            <div className="hero-ed__visual">
              <Image
                src={workspace}
                alt="A FY Devs desk: a laptop showing the EV Exec website we built, beside a FY Devs mug, notebook and business cards."
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
                  Websites <br />
                  and software{" "}
                  <span className="serif-em">
                    that grow <br />
                    your business.
                  </span>
                </h1>
                <p className="lede rise" style={{ "--i": 2 } as React.CSSProperties}>
                  Bespoke websites that win enquiries, and software that saves your team time. Published prices, no
                  templates.
                </p>
                <div className="btn-row rise" style={{ "--i": 3 } as React.CSSProperties}>
                  <Link href="/contact?topic=website" className="btn btn--primary">
                    Start a Project
                    <ArrowRight />
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
        }
      >
        <section aria-label="Recent work" data-nav="/work" className="container container--wide showcase-section">
          <ShowcaseStage items={projects} />
        </section>
      </LaptopZoom>

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
              <span>websites from</span>
            </li>
            <li>
              <strong>0</strong>
              <span>templates used</span>
            </li>
            <li>
              <strong>2</strong>
              <span>software products built</span>
            </li>
          </ul>
          <p className="proof__more">
            <Link href="/work" className="arrow-link">
              Read the case studies <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      {/* Web design */}
      <section id="web-design" data-nav="/websites" className="section" aria-labelledby="web-title">
        <div className="container container--wide split split--media-wide service-split">
          <div className="stack" style={{ "--stack": "var(--space-5)" } as React.CSSProperties} data-reveal>
            <p className="eyebrow eyebrow--num">Web design & development</p>
            <h2 id="web-title" className="h2">
              A website that brings <span className="serif-em">you customers.</span>
            </h2>
            <p className="lede">Bespoke websites built to turn visitors into enquiries and sales.</p>
            <ul role="list" className="benefits">
              {webBenefits.map((title) => (
                <li key={title}>
                  <strong>{title}</strong>
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
            <p className="media-caption">Boonma, a client website.</p>
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
              Booking systems, customer portals and web apps, from a team that runs its own platform.
            </p>
            <ul role="list" className="benefits">
              {saasBenefits.map((title) => (
                <li key={title}>
                  <strong>{title}</strong>
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
            <p className="media-caption">FYStay, our own platform.</p>
          </div>
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
              Starting points for bespoke work, confirmed in writing before you commit.{" "}
              <Link href="/websites#packages">Everything included</Link>.
            </p>
          </div>
        </div>

        <div data-reveal>
          <PlanSwiper plans={plans} initial="professional" label="Starting prices" />
        </div>

        <div className="container container--wide">
          <div className="estimate-prompt" data-reveal>
            <p>
              <strong>What would yours cost?</strong> Answer a few quick questions for an instant estimate.
            </p>
            <Link href="/build" className="btn btn--primary">
              Get my estimate
              <ArrowRight />
            </Link>
          </div>
          <div className="mt-6">
            <PricingNotice />
          </div>

          {/* Ongoing services */}
          <div id="ongoing" className="ongoing" data-reveal>
            <div className="ongoing__intro">
              <h3 className="h3">After launch: hosting and care</h3>
              <p className="muted small">Optional monthly plans, priced separately from your build.</p>
            </div>
          </div>
        </div>

        <div data-reveal>
          <PlanSwiper
            plans={carePlanCards.map((plan) => ({ ...plan, includes: plan.includes?.slice(0, careHighlights) }))}
            initial="care"
            label="Hosting and care plans"
          />
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
            <p className="muted">Nothing to pay until you&apos;ve approved a written scope and price.</p>
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
        title={<>Ready to <span className="serif-em">start?</span></>}
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
