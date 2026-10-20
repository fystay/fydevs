import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { AppTour } from "@/components/interactive/AppTour";
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
  ["The apps, live", "The operator and driver apps as they work today."],
  ["Fit with your operation", "Your bookings, vehicles and drivers, and where the software fits."],
  ["Devices and set-up", "What your team would use and what's needed to start."],
  ["Pricing and terms", "Confirmed individually while the product is in early release."],
  ["Onboarding and support", "How we'd bring your team on board, and support after."],
];

export default function BookingSoftwarePage() {
  return (
    <>
      <PageHero
        service="booking"
        eyebrow="Booking software"
        title={
          <>
            Booking software, <span className="serif-em">proven on the road.</span>
          </>
        }
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

      {/* The product, shown rather than described */}
      <section className="section inverse" aria-labelledby="tour-title">
        <div className="container container--wide">
          <SectionHead
            eyebrow="Inside the apps"
            title={
              <span id="tour-title">
                Built inside a real operation, <span className="serif-em">used every day.</span>
              </span>
            }
            split
          >
            <p>One app for the office, one for the drivers, shaped by how {evexec.name} runs day to day.</p>
          </SectionHead>
          <AppTour />
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
                We also design the websites customers book through. {evexec.name}&apos;s takes bookings in three steps,
                with flight numbers, extra stops and returns, and gives customers an account to manage them.
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
          <SectionHead
            eyebrow="Product or bespoke?"
            title={
              <>
                Two routes, <span className="serif-em">depending on how you work.</span>
              </>
            }
          />
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
                <Link href="/app-development" className="arrow-link">
                  App development <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="section section--ruled">
        <div className="container container--wide">
          <SectionHead
            eyebrow="The demo"
            title={
              <>
                What we&apos;ll <span className="serif-em">cover together.</span>
              </>
            }
            split
          >
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
        title={
          <>
            See it <span className="serif-em">working.</span>
          </>
        }
        body="Tell us a little about your operation and we'll arrange a demo at a time that suits you."
      >
        <Link href="/contact?topic=booking-software" className="btn btn--primary">
          Request a demo
        </Link>
      </CtaBand>
    </>
  );
}
