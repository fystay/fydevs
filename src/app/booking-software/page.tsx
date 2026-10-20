import { Archivo, Jost } from "next/font/google";
import Link from "next/link";
import { CtaBand, SectionHead } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { ServiceSwitcher } from "@/components/ServiceSwitcher";
import { AppTour } from "@/components/interactive/AppTour";
import { BookingDemo } from "@/components/interactive/BookingDemo";
import { BookingStudio } from "@/components/interactive/BookingStudio";
import { PhoneFan } from "@/components/interactive/PhoneFan";
import { pageMetadata } from "@/lib/metadata";
import { projectBySlug } from "@/lib/projects";

// The typefaces of the booking flows shown on this page: EV Exec's, and Alex K Bells' for the bold look.
const jost = Jost({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-jost", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-archivo", display: "swap" });

export const metadata = pageMetadata(
  "/booking-software",
  "Booking software for your business",
  "Booking apps for any business, with payments, your branding and an operator app. Proven at EV Exec.",
);

const evexec = projectBySlug("ev-exec")!;

/* Shown, not described: the replay, the configurator and the real app screens do the selling. */
export default function BookingSoftwarePage() {
  return (
    <>
      {/* The hero: the office and driver apps on a fan of phones you can swipe round. */}
      <section className="tile inverse booking-hero" aria-labelledby="hero-title">
        <div className="container container--wide">
          <ServiceSwitcher current="booking" />
          <h1 id="hero-title" className="tile__title rise" style={{ "--i": 1 } as React.CSSProperties}>
            Run the office. <span className="serif-em">Run the road.</span>
          </h1>
          <p className="tile__line rise" style={{ "--i": 2 } as React.CSSProperties}>
            Operator and driver apps, proven at {evexec.name}.
          </p>
          <div className="tile__ctas rise" style={{ "--i": 3 } as React.CSSProperties}>
            <Link href="/contact?topic=booking-software" className="btn btn--primary">
              Request a demo
            </Link>
            <Link href="#flow" className="btn btn--secondary">
              See it work
            </Link>
          </div>
        </div>
        <div className="container container--wide tile__visual rise" style={{ "--i": 4 } as React.CSSProperties}>
          <PhoneFan />
        </div>
      </section>

      {/* The whole journey, played out: the customer books, the office is pinged. */}
      <section id="flow" className={`section booking-flow ${jost.variable}`} aria-labelledby="flow-title">
        <div className="container container--wide">
          <SectionHead
            eyebrow="The customer side"
            title={
              <span id="flow-title">
                Booked in a minute. <span className="serif-em">In your app in a second.</span>
              </span>
            }
          />
          <BookingDemo />
          <p className="media-caption booking-flow__caption">
            Built by FY Devs for {evexec.name} · Example details · <Link href="/work#ev-exec">See the project</Link>
          </p>
        </div>
      </section>

      {/* Not just airports: the visitor restyles the app for their own business. */}
      <section
        id="make-it-yours"
        className={`section section--ruled ${jost.variable} ${archivo.variable}`}
        aria-labelledby="studio-title"
      >
        <div className="container container--wide">
          <SectionHead
            eyebrow="Make it yours"
            title={
              <span id="studio-title">
                Your business. <span className="serif-em">Your booking app.</span>
              </span>
            }
          />
          <BookingStudio />
          <p className="studio__more">
            <Link href="/app-development" className="arrow-link">
              Something different in mind? App development <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      {/* The real system: swipe from the office's app to the drivers'. */}
      <section className="section inverse" aria-labelledby="tour-title">
        <div className="container container--wide">
          <SectionHead
            eyebrow="Inside the apps"
            title={
              <span id="tour-title">
                Built inside a real operation, <span className="serif-em">used every day.</span>
              </span>
            }
          />
          <AppTour />
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
