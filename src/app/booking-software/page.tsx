import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/Blocks";
import { BrowserFrame } from "@/components/Devices";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";
import { projectBySlug } from "@/lib/projects";
import evexecBooking from "../../../public/work/evexec-booking.webp";

export const metadata = pageMetadata(
  "/booking-software",
  "Booking software for taxi operators",
  "Driver and operator applications developed for EV Exec, an executive airport transfer business. Request a demo to see whether they fit your operation.",
);

const evexec = projectBySlug("ev-exec")!;

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
        title="Booking software, proven on the road."
        lede={`Driver and operator applications developed for ${evexec.name}, an executive airport transfer business on the Fylde Coast. If you run a taxi or transfer firm, we'd like to show you how they work.`}
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
          <div className="split split--media-wide">
            <div className="stack" style={{ "--stack": "var(--space-6)" } as React.CSSProperties}>
              <p className="eyebrow eyebrow--num">Origin</p>
              <h2 className="h2">Built inside a real operation, not in the abstract.</h2>
              <p className="muted">
                The software was developed for {evexec.name} and shaped by how a transfer business actually runs day to
                day. That&apos;s the standard we hold it to: it has to work for the people doing the job.
              </p>
              <div className="grid-2" style={{ rowGap: "var(--space-6)" }}>
                <div className="feature">
                  <h3 className="h3">For operators</h3>
                  <p className="muted small">
                    For the people who run the business: the office, the controllers and the owners who keep work
                    organised and moving.
                  </p>
                </div>
                <div className="feature">
                  <h3 className="h3">For drivers</h3>
                  <p className="muted small">
                    For the people on the road, designed around airport and transfer work rather than a generic job
                    list.
                  </p>
                </div>
              </div>
            </div>
            <figure>
              <div className="media-panel">
                <BrowserFrame
                  src={evexec.desktop}
                  host={evexec.host}
                  alt="The EV Exec website: premium airport transfers and private hire"
                  sizes="(min-width: 64rem) 640px, 90vw"
                />
              </div>
              <figcaption className="media-caption">
                {evexec.name}, the transfer business the software was developed for. Its website is also our work.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <div className="split">
            <figure>
              <div className="media-panel" style={{ background: "#0c1220" }}>
                <Image
                  src={evexecBooking}
                  alt="EV Exec's online booking, step 1 of 3: choose to or from the airport, and one way or return"
                  sizes="(min-width: 64rem) 520px, 90vw"
                  placeholder="blur"
                  style={{ width: "100%", height: "auto", borderRadius: "var(--radius-md)" }}
                />
              </div>
              <figcaption className="media-caption">
                {evexec.name}&apos;s customer booking flow on evexec.co.uk, designed and built by FY Devs.
              </figcaption>
            </figure>
            <div className="stack" style={{ "--stack": "var(--space-5)" } as React.CSSProperties}>
              <p className="eyebrow eyebrow--num">The customer side</p>
              <h2 className="h2">Need a booking website too?</h2>
              <p className="muted">
                We also design the websites customers book through. {evexec.name}&apos;s site takes bookings in three
                steps (journey, addresses, then trip details including flight numbers, extra stops and returns) and
                gives customers an account to manage them.
              </p>
              <p>
                <Link href="/work#ev-exec" className="arrow-link">
                  See the {evexec.name} project <ArrowRight />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fit" className="section section--ruled">
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
