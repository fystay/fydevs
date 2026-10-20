import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PricingNotice } from "@/components/Blocks";
import { ServiceSwitcher } from "@/components/ServiceSwitcher";
import { ArrowRight, Stopwatch } from "@/components/Icons";
import { LaptopZoom, type ScreenQuad } from "@/components/interactive/LaptopZoom";
import { ShowcaseStage } from "@/components/interactive/ShowcaseStage";
import { CARE_PLANS, PACKAGES, formatGBP } from "@/lib/pricing";
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

const boonma = projectBySlug("boonma")!;
const fystay = projectBySlug("fystay")!;

// Four steps, a few words each: the detail lives on the service pages.
const steps = [
  ["Enquire", "Tell us what you need."],
  ["Scope", "A fixed price, in writing."],
  ["Build", "Designed and built with you."],
  ["Launch", "Live, handed over, supported."],
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
                  Websites and apps <span className="serif-em">that grow your business.</span>
                </h1>
                <p className="lede rise" style={{ "--i": 2 } as React.CSSProperties}>
                  Bespoke, mobile-first, priced in the open.
                </p>
                <div className="btn-row rise" style={{ "--i": 3 } as React.CSSProperties}>
                  <Link href="/contact?topic=website" className="btn btn--primary">
                    Start a Project
                    <ArrowRight />
                  </Link>
                  <Link href="/build" className="btn btn--secondary hero-estimate-btn">
                    <Stopwatch />
                    Instant estimate
                  </Link>
                </div>
                <p className="hero-note rise" style={{ "--i": 4 } as React.CSSProperties}>
                  Indicative price · about 2 minutes
                </p>
                {/* Phones: a slim link in place of the second button, so it stays clear of the laptop in the photo. */}
                <Link href="/build" className="hero-estimate rise" style={{ "--i": 4 } as React.CSSProperties}>
                  <Stopwatch size={14} />
                  Instant estimate <span className="hero-estimate__time">· 2 min</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        }
      >
        <section aria-label="Recent work" data-nav="/work" className="container container--wide showcase-section">
          <ShowcaseStage items={projects} />
        </section>
      </LaptopZoom>

      {/* One quiet, true line under the showcase. */}
      <p className="container container--wide family-line">
        Every site here runs a family business. <em>Ours.</em>
      </p>

      {/*
        Below the showcase, one product per screen: a name, a few words, two buttons and a
        big visual. Detail and full pricing live on the service pages.
      */}
      <section id="web-design" data-nav="/websites" className="tile" aria-labelledby="web-title">
        <div className="container container--wide" data-reveal>
          <p className="tile__name">Websites</p>
          <h2 id="web-title" className="tile__title">
            Built to win <span className="serif-em">customers.</span>
          </h2>
          <p className="tile__line">
            Bespoke design, fast on every phone.{" "}
            <Link href="/pricing" className="tile__price">
              From {formatGBP(PACKAGES.essential.from)}
            </Link>
            .
          </p>
          <div className="tile__ctas">
            <Link href="/contact?topic=website" className="btn btn--primary">
              Start a Project
            </Link>
            <Link href="/pricing" className="btn btn--secondary">
              See prices
            </Link>
          </div>
        </div>
        <div className="container container--wide tile__visual" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          <Link href="/work#boonma" className="duo" aria-label="Boonma, a website we designed and built">
            <span className="duo__screen">
              <Image src={boonma.desktop} alt="" sizes="(min-width: 64rem) 900px, 90vw" placeholder="blur" />
            </span>
            <span className="app-phone duo__phone">
              <Image src={boonma.mobile} alt="" sizes="(min-width: 64rem) 200px, 22vw" placeholder="blur" />
            </span>
          </Link>
        </div>
      </section>

      <div className="tiles-2">
        <section id="apps" data-nav="/app-development" className="tile tile--card" aria-labelledby="apps-title">
          <div data-reveal>
            <p className="tile__name">App development</p>
            <h2 id="apps-title" className="tile__title tile__title--sm">
              Built around <span className="serif-em">how you work.</span>
            </h2>
            <p className="tile__line">Web and mobile apps, portals and tools.</p>
            <div className="tile__ctas">
              <Link href="/contact?topic=bespoke" className="btn btn--primary">
                Build My App
              </Link>
              <Link href="/app-development" className="btn btn--secondary">
                Learn more
              </Link>
            </div>
          </div>
          <Link href="/work#fystay" className="tile__shot" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            <Image
              src={fystay.desktop}
              alt="FYStay, the holiday stays platform we built and run"
              sizes="(min-width: 64rem) 560px, 90vw"
              placeholder="blur"
            />
          </Link>
        </section>

        <section id="care" data-nav="/websites" className="tile tile--card tile--dark" aria-labelledby="care-title">
          <div data-reveal>
            <p className="tile__name">Hosting &amp; care</p>
            <h2 id="care-title" className="tile__title tile__title--sm">
              Looked after, <span className="serif-em">every month.</span>
            </h2>
            <p className="tile__line">Hosting, backups and updates, handled.</p>
            <div className="tile__ctas">
              <Link href="/pricing#care" className="btn btn--primary">
                See plans
              </Link>
            </div>
          </div>
          <p className="tile__figure" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            <span>From</span> {formatGBP(CARE_PLANS.hosting.monthly)}
            <span>/month</span>
          </p>
        </section>
      </div>

      {/* The price promise: the quickest route to a real number. */}
      <section id="pricing" data-nav="/websites" className="price-strip" aria-labelledby="pricing-title">
        <div className="container container--wide" data-reveal>
          <h2 id="pricing-title" className="tile__title">
            Your price, <span className="serif-em">before you commit.</span>
          </h2>
          <p className="tile__line">An instant estimate in two minutes.</p>
          <div className="tile__ctas">
            <Link href="/build" className="btn btn--primary">
              Instant estimate
              <ArrowRight />
            </Link>
            <Link href="/pricing" className="btn btn--secondary">
              See all prices
            </Link>
          </div>
          <div className="price-strip__notice">
            <PricingNotice compact />
          </div>
        </div>
      </section>

      <section id="process" data-nav="/about" className="tile" aria-labelledby="process-title">
        <div className="container container--wide" data-reveal>
          <h2 id="process-title" className="tile__title tile__title--sm">
            Four steps. <span className="serif-em">No surprises.</span>
          </h2>
          <p className="tile__line">Nothing to pay until you approve the scope.</p>
        </div>
        <div className="container container--wide">
          <ol role="list" className="four-steps">
            {steps.map(([title, body], i) => (
              <li key={title} data-reveal style={{ "--d": i } as React.CSSProperties}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="container container--wide four-steps__more">
          <Link href="/faq" className="arrow-link">
            Questions? <ArrowRight />
          </Link>
        </p>
      </section>

      <CtaBand
        title={
          <>
            Your business <span className="serif-em">could be next.</span>
          </>
        }
        body="Tell us what you need. Honest advice and a clear next step."
      >
        <Link href="/contact?topic=website" className="btn btn--primary">
          Start a Project
        </Link>
        <Link href="/build" className="btn btn--secondary">
          <Stopwatch />
          Instant estimate
        </Link>
      </CtaBand>
    </>
  );
}
