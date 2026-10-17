import Link from "next/link";
import { ArrowLink, CtaBand, PricingNotice, SectionHead } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { QuickEstimate } from "@/components/estimate/QuickEstimate";
import { PACKAGES, formatGBP, type PackageId } from "@/lib/pricing";
import { site } from "@/lib/site";

const principles = [
  {
    title: "Bespoke, not reskinned",
    body: "Every site starts from your business, your customers and your brand. We don't sell templates with your logo dropped in.",
  },
  {
    title: "Prices you can see",
    body: "Configure your project and see an indicative price straight away, with what's included, what isn't and what recurs each month.",
  },
  {
    title: "Built properly",
    body: "Fast, accessible and responsive by default, with clean technical SEO foundations and code that can be maintained after launch.",
  },
  {
    title: "Technology with a purpose",
    body: "Booking flows, integrations and custom features are added when they solve a real problem, not because they look impressive.",
  },
];

const steps = [
  ["Configure", "Answer a few questions and get an indicative price in minutes."],
  ["Confirm scope", "We review your brief, agree deliverables and confirm the price in writing."],
  ["Design", "A visual direction built around your brand, refined over agreed revision rounds."],
  ["Build & test", "Responsive development, tested across devices, browsers and keyboards."],
  ["Launch & care", "We put the site live and, if you choose, host and maintain it afterwards."],
];

const packageOrder: PackageId[] = ["essential", "professional", "premium"];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container container--wide hero__grid">
          <div>
            <p className="eyebrow rise">Bespoke websites · Booking software</p>
            <h1 className="display rise" style={{ "--i": 1 } as React.CSSProperties}>
              Built around the way your business <span className="serif-em">works.</span>
            </h1>
            <p className="lede rise" style={{ "--i": 2 } as React.CSSProperties}>
              {site.name} designs and builds distinctive websites for businesses that want to stand apart, and
              booking software for firms that run on schedules. Clear prices, careful engineering, no templates.
            </p>
            <div className="btn-row rise" style={{ "--i": 3 } as React.CSSProperties}>
              <Link href="/build" className="btn btn--primary">
                Build your website
                <ArrowRight />
              </Link>
              <Link href="/booking-software" className="btn btn--secondary">
                Explore booking software
              </Link>
            </div>
          </div>
          <div className="rise" style={{ "--i": 4 } as React.CSSProperties}>
            <QuickEstimate />
          </div>
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="paths-title">
        <div className="container container--wide">
          <SectionHead eyebrow="Two ways we help" title={<span id="paths-title">Start where your business is.</span>} />
          <div className="grid-2">
            <Link href="/websites" className="card path-card">
              <p className="eyebrow">Websites</p>
              <h3 className="h2">A website that does your business justice.</h3>
              <p className="muted">
                Bespoke design and development for businesses that need credibility, enquiries and sales. Choose a
                package, configure the extras and see the price as you go.
              </p>
              <div className="path-card__foot">
                <span className="arrow-link">
                  Services and packages <ArrowRight />
                </span>
              </div>
            </Link>
            <Link href="/booking-software" className="card path-card path-card--dark">
              <p className="eyebrow" style={{ color: "var(--color-inverse-ink-2)" }}>
                Booking software
              </p>
              <h3 className="h2">Software for businesses that run on bookings.</h3>
              <p className="muted">
                A driver and operator application developed for a working airport taxi business. Talk to us about
                whether it fits your operation.
              </p>
              <div className="path-card__foot">
                <span className="arrow-link">
                  See the product <ArrowRight />
                </span>
              </div>
            </Link>
          </div>
          <p className="muted small mt-6">
            Need something that doesn&apos;t fit either?{" "}
            <Link href="/bespoke-systems">Bespoke booking platforms and integrations</Link> are scoped individually.
          </p>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="How we work" title="What you can expect from us." split>
            <p>
              Agency projects are often slow to quote and vague about cost. We&apos;ve designed {site.name} to be
              the opposite: clear choices, visible prices and a scope agreed before any commitment.
            </p>
          </SectionHead>
          <div className="grid-2" style={{ rowGap: "var(--space-7)" }}>
            {principles.map((p) => (
              <div key={p.title} className="feature">
                <h3 className="h3">{p.title}</h3>
                <p className="muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="pricing-title">
        <div className="container container--wide">
          <SectionHead
            eyebrow="Packages"
            title={<span id="pricing-title">Three clear starting points.</span>}
            split
          >
            <p>
              Each package defines what&apos;s included and where the limits are. Add what you need in the
              configurator and the estimate updates as you go.
            </p>
          </SectionHead>
          <div className="grid-3">
            {packageOrder.map((id) => {
              const pkg = PACKAGES[id];
              return (
                <div key={id} className="card package">
                  <div className="stack" style={{ "--stack": "var(--space-2)" } as React.CSSProperties}>
                    <h3 className="h3">{pkg.name}</h3>
                    <p className="muted small">{pkg.summary}</p>
                  </div>
                  <p className="package__price">
                    <span className="fine">From</span>
                    <strong>{formatGBP(pkg.from)}</strong>
                  </p>
                  <ul role="list" className="checks">
                    {pkg.includes.slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-6" style={{ display: "grid", gap: "var(--space-5)" }}>
            <PricingNotice />
            <div className="btn-row">
              <ArrowLink href="/websites#packages">Compare packages in full</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="Process" title="From first answer to launch." />
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

      <CtaBand
        title="Tell us what you're building."
        body="Configure a website for an instant estimate, or send us a note about software and bespoke systems."
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
