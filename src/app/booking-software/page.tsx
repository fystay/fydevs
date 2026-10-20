import Link from "next/link";
import { CtaBand } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { ServiceSwitcher } from "@/components/ServiceSwitcher";
import { BookingDemo } from "@/components/interactive/BookingDemo";
import { BookingStudio } from "@/components/interactive/BookingStudio";
import { PhoneFan } from "@/components/interactive/PhoneFan";
import { archivo, jost } from "@/lib/fonts";
import { pageMetadata } from "@/lib/metadata";
import { projectBySlug } from "@/lib/projects";

export const metadata = pageMetadata(
  "/booking-software",
  "Booking software for your business",
  "Booking apps for any business, with payments, your branding and an operator app. Proven at EV Exec.",
);

const evexec = projectBySlug("ev-exec")!;

/*
 * Shown, not described: first the visitor makes the app their own (the configurator, on
 * the first screen), then a booking plays out (the replay) and lands in the office's and
 * drivers' apps (the real screens).
 */
export default function BookingSoftwarePage() {
  return (
    <>
      {/* First screen: the visitor restyles the booking app for their own business. */}
      <section
        id="make-it-yours"
        className={`tile booking-hero ${jost.variable} ${archivo.variable}`}
        aria-labelledby="hero-title"
      >
        <div className="container container--wide">
          <ServiceSwitcher current="booking" />
          <h1
            id="hero-title"
            className="tile__title booking-hero__title rise"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Your business. <span className="serif-em">Your booking app.</span>
          </h1>
        </div>
        <div className="container container--wide booking-studio rise" style={{ "--i": 2 } as React.CSSProperties}>
          <BookingStudio />
          <p className="studio__more">
            <Link href="/app-development" className="arrow-link">
              Something different in mind? App development <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      {/* The whole journey, played out: the customer books, the office is pinged. */}
      <section id="flow" className={`tile ${jost.variable}`} aria-labelledby="flow-title">
        <div className="container container--wide" data-reveal>
          <p className="tile__name">The customer side</p>
          <h2 id="flow-title" className="tile__title">
            Booked in a minute. <span className="serif-em">In your app in a second.</span>
          </h2>
          <p className="tile__line">Proven every day at {evexec.name}.</p>
          <div className="tile__ctas">
            <Link href="/contact?topic=booking-software" className="btn btn--primary">
              Request a demo
              <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="container container--wide tile__visual tile__visual--pad" data-reveal>
          <BookingDemo />
          <p className="booking-caption">
            Built for {evexec.name} · Example details · <Link href="/work#ev-exec">See the project</Link>
          </p>
        </div>
      </section>

      {/* Where the booking lands: the office's app and the drivers', swipeable. */}
      <section id="apps" className="tile inverse" aria-labelledby="apps-title">
        <div className="container container--wide" data-reveal>
          <h2 id="apps-title" className="tile__title">
            Run the office. <span className="serif-em">Run the road.</span>
          </h2>
          <p className="tile__line">Operator and driver apps. Real screens, example details.</p>
        </div>
        <div className="container container--wide tile__visual" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          <PhoneFan />
        </div>
      </section>

      <CtaBand
        title={
          <>
            See it <span className="serif-em">working.</span>
          </>
        }
        body="Live demo. No obligation."
      >
        <Link href="/contact?topic=booking-software" className="btn btn--primary">
          Request a demo
        </Link>
      </CtaBand>
    </>
  );
}
