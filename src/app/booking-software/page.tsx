import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/booking-software",
  "Booking software for taxi operators",
  "A driver and operator application developed for a working airport taxi business. Request a demo to see whether it fits your operation.",
);

const demoAgenda = [
  ["The current feature set", "A walkthrough of the operator and driver applications as they work today."],
  ["Fit with your operation", "How your bookings, vehicles and drivers are organised, and where the software fits."],
  ["Devices and set-up", "Which devices your team would use, and what's needed to get started."],
  ["Pricing and terms", "Subscription pricing and terms, which we confirm individually while the product is in its early release."],
  ["Onboarding and support", "How we'd bring your team on board and what support looks like afterwards."],
];

export default function BookingSoftwarePage() {
  return (
    <>
      <PageHero
        eyebrow="Booking software"
        title="Software for taxi and airport transfer operators."
        lede="A driver and operator application, developed for a working airport taxi business. If you run a taxi or transfer firm, we'd like to show you how it works."
      >
        <div className="btn-row">
          <Link href="/contact?topic=booking-software" className="btn btn--primary">
            Request a demo
            <ArrowRight />
          </Link>
          <Link href="#fit" className="btn btn--secondary">
            Is it right for you?
          </Link>
        </div>
      </PageHero>

      <section className="section inverse">
        <div className="container container--wide">
          <SectionHead eyebrow="Origin" title="Built inside a real operation, not in the abstract." split>
            <p>
              The software was developed for an airport taxi business and shaped by how that business actually runs
              day to day. That&apos;s the standard we hold it to: it has to work for people doing the job.
            </p>
          </SectionHead>
          <div className="grid-2" style={{ rowGap: "var(--space-7)" }}>
            <div className="feature">
              <h3 className="h3">For operators</h3>
              <p className="muted">
                An application for the people who run the business: the office, the controllers and the owners who
                keep work organised and moving.
              </p>
            </div>
            <div className="feature">
              <h3 className="h3">For drivers</h3>
              <p className="muted">
                An application for the people on the road, designed around the realities of airport and transfer
                work rather than a generic job list.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fit" className="section">
        <div className="container container--wide">
          <SectionHead eyebrow="Product or bespoke?" title="Two routes, depending on how you work." />
          <div className="grid-2">
            <div className="card stack" style={{ "--stack": "var(--space-4)" } as React.CSSProperties}>
              <p className="eyebrow">The product</p>
              <h3 className="h3">For taxi and transfer firms</h3>
              <p className="muted">
                If you run taxis, airport transfers or a similar driver-and-dispatch operation, start here. A demo is
                the quickest way to see whether the product suits you.
              </p>
              <div className="path-card__foot">
                <Link href="/contact?topic=booking-software" className="arrow-link">
                  Request a demo <ArrowRight />
                </Link>
              </div>
            </div>
            <div className="card stack" style={{ "--stack": "var(--space-4)" } as React.CSSProperties}>
              <p className="eyebrow">Bespoke</p>
              <h3 className="h3">For workflows of your own</h3>
              <p className="muted">
                If your bookings, pricing or operations work differently, or you need deep integration with existing
                systems, a tailored platform may serve you better.
              </p>
              <div className="path-card__foot">
                <Link href="/bespoke-systems" className="arrow-link">
                  Bespoke systems <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="The demo" title="What we'll cover together." split>
            <p>
              We&apos;d rather show you the software working than list features on a page. There&apos;s no obligation,
              and we&apos;ll tell you plainly if it isn&apos;t the right fit.
            </p>
          </SectionHead>
          <ol role="list" className="ruled-list">
            {demoAgenda.map(([title, body], i) => (
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
        title="See it working."
        body="Tell us a little about your operation and we'll arrange a demo at a time that suits you."
      >
        <Link href="/contact?topic=booking-software" className="btn btn--primary">
          Request a demo
        </Link>
      </CtaBand>
    </>
  );
}
