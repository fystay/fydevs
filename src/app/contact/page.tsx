import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/Blocks";
import { ContactForm } from "@/components/ContactForm";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/contact",
  "Start a project",
  "Tell FY Devs about your website or software project: what you need, your budget, your goals and your timeline.",
);

const next = [
  ["We review your enquiry", "Your goals, budget and timeline tell us how we can help."],
  ["We reply by email", "With questions, honest advice, or a suggested next step."],
  ["Discovery call", "A short conversation about your goals, if the project is a good fit."],
  ["Written scope & price", "A fixed quote to approve. Nothing to pay until you do."],
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Start a project"
        title="Tell us what you need."
        lede="Four quick questions: project type, budget, timeline and goals. It takes about a minute."
      />
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          <div className="contact-grid">
            <div className="card card--raised">
              <Suspense fallback={<p className="muted">Loading form…</p>}>
                <ContactForm />
              </Suspense>
            </div>
            <aside className="stack" style={{ "--stack": "var(--space-7)" } as React.CSSProperties}>
              <div>
                <h2 className="h3">What happens next</h2>
                <ol role="list" className="next-steps mt-5">
                  {next.map(([title, body], i) => (
                    <li key={title}>
                      <span className="next-steps__num">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="feature">
                <h2 className="h3">Want a price first?</h2>
                <p className="muted">
                  The website configurator gives you an indicative price in about two minutes and sends us a complete
                  brief.
                </p>
                <p className="mt-4">
                  <Link href="/build" className="arrow-link">
                    Get an instant estimate <ArrowRight />
                  </Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
