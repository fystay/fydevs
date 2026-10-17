import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/Blocks";
import { ContactForm } from "@/components/ContactForm";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/contact",
  "Contact",
  "Ask a question, request a booking software demo or tell us about a bespoke project.",
);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start a conversation."
        lede="Ask a question, request a demo of our booking software, or tell us about a project. We reply by email."
      />
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          <div className="grid-2" style={{ gap: "var(--space-8)", alignItems: "start" }}>
            <div className="card card--raised">
              <Suspense fallback={<p className="muted">Loading form…</p>}>
                <ContactForm />
              </Suspense>
            </div>
            <div className="stack" style={{ "--stack": "var(--space-6)" } as React.CSSProperties}>
              <div className="feature">
                <h2 className="h3">Planning a website?</h2>
                <p className="muted">
                  The configurator gives you an indicative price in a few minutes and sends us a complete brief.
                </p>
                <p className="mt-4">
                  <Link href="/build" className="arrow-link">
                    Build your website <ArrowRight />
                  </Link>
                </p>
              </div>
              <div className="feature">
                <h2 className="h3">Booking software demo</h2>
                <p className="muted">
                  Choose &ldquo;Booking software&rdquo; and tell us a little about your fleet and how you take bookings
                  today.
                </p>
              </div>
              <div className="feature">
                <h2 className="h3">Bespoke systems</h2>
                <p className="muted">
                  Describe what you do and what isn&apos;t working. We&apos;ll suggest a sensible first step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
