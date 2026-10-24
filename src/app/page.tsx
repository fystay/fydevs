import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/Blocks";
import { ServiceSwitcher } from "@/components/ServiceSwitcher";
import { ArrowRight, Stopwatch } from "@/components/Icons";
import { BookingDemo } from "@/components/interactive/BookingDemo";
import { FamilyLine } from "@/components/interactive/FamilyLine";
import { LaptopZoom, type ScreenQuad } from "@/components/interactive/LaptopZoom";
import { SheetToApp } from "@/components/interactive/SheetToApp";
import { ShowcaseStage } from "@/components/interactive/ShowcaseStage";
import { SiteStyler } from "@/components/interactive/SiteStyler";
import { WebStages } from "@/components/WebStages";
import { archivo, jost } from "@/lib/fonts";
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

const evexec = projectBySlug("ev-exec")!;

// Each owner's own words, approved by them; keep them true to how the business runs today.
const OWNER_QUOTES = [
  {
    project: evexec,
    quote:
      "Customers book their airport transfer on their phone in a minute, and I get the job straight away. It runs the business while I\u2019m driving.",
  },
  {
    project: projectBySlug("boonma")!,
    quote:
      "Clients find a treatment, see the price and book a time, all from their phone. It feels like our studio.",
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
                  <ArrowRight className="hero-estimate__arrow" />
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

      {/* One true line, full screen after the showcase, typed out as it arrives. */}
      <FamilyLine />

      {/* The owners of EV Exec and Boonma, in their own words (approved by them), right after the line that says they're ours. Phones swipe between them. */}
      <section className="owner-quotes" aria-label="From the owners">
        <div className="container container--wide" data-reveal>
          <div className="owner-quotes__row" tabIndex={0}>
            {OWNER_QUOTES.map(({ project, quote }) => (
              <figure key={project.slug}>
                <blockquote>
                  <p>{`\u201C${quote}\u201D`}</p>
                </blockquote>
                <figcaption>
                  <Image src={project.logo} alt="" width={36} height={36} />
                  Owner, {project.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/*
        Below the showcase, one product per screen: a name, a few words, one link and a
        big visual. Detail and full pricing live on the service pages.
      */}
      <section
        id="web-design"
        data-nav="/websites"
        className={`tile ${jost.variable} ${archivo.variable}`}
        aria-labelledby="web-title"
      >
        <div className="container container--wide" data-reveal>
          <p className="tile__name">Websites</p>
          <h2 id="web-title" className="tile__title">
            Built to win <span className="serif-em">customers.</span>
          </h2>
          <p className="tile__line">Bespoke design, fast on every phone.</p>
          {/* Both prices in one place: the website, and the care that keeps it running. */}
          <dl className="price-pair">
            <div>
              <dt>Website from</dt>
              <dd>{formatGBP(PACKAGES.essential.from)}</dd>
            </div>
            <div>
              <dt>Hosting &amp; care</dt>
              <dd>
                {formatGBP(CARE_PLANS.hosting.monthly)}
                <span>/month</span>
              </dd>
            </div>
          </dl>
          <p className="tile__more tile__more--pair">
            <Link href="/pricing" className="arrow-link">
              See prices <ArrowRight />
            </Link>
            <Link href="/build" className="arrow-link">
              Your price in 2 minutes <ArrowRight />
            </Link>
          </p>
        </div>
        <div className="container container--wide tile__visual" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          <SiteStyler />
        </div>
      </section>

      {/* Booking software, shown working: a customer books, the office is pinged. */}
      <section
        id="booking"
        data-nav="/booking-software"
        className={`tile inverse ${jost.variable}`}
        aria-labelledby="booking-title"
      >
        <div className="container container--wide" data-reveal>
          <p className="tile__name">Booking software</p>
          <h2 id="booking-title" className="tile__title">
            Booking apps, <span className="serif-em">for any business.</span>
          </h2>
          <p className="tile__line">Proven every day at {evexec.name}.</p>
          <p className="tile__more">
            <Link href="/booking-software" className="arrow-link">
              See it work <ArrowRight />
            </Link>
          </p>
        </div>
        <div className="container container--wide tile__visual tile__visual--pad" data-reveal>
          <BookingDemo />
        </div>
      </section>

      <section id="apps" data-nav="/app-development" className="tile" aria-labelledby="apps-title">
        <div className="container container--wide" data-reveal>
          <p className="tile__name">App development</p>
          <h2 id="apps-title" className="tile__title">
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
        {/* The App development hero's finished app (it plays in full on that page). */}
        <div className="tile__sta" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          <SheetToApp still />
        </div>
      </section>

      <section id="process" data-nav="/about" className="tile" aria-labelledby="process-title">
        <div className="container container--wide" data-reveal>
          <p className="tile__name">How it works</p>
          <h2 id="process-title" className="tile__title">
            Four steps. <span className="serif-em">No surprises.</span>
          </h2>
          <p className="tile__line">Nothing to pay until you approve the scope.</p>
        </div>
        <div className="container container--wide apps-tile__body">
          <WebStages />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Your business <span className="serif-em">could be next.</span>
          </>
        }
        body={
          <>
            Tell us what you need. Honest advice and a clear next step. <Link href="/faq">Questions?</Link>
          </>
        }
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
