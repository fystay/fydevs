import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/Blocks";
import { PhoneFrame } from "@/components/Devices";
import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata = pageMetadata(
  "/about",
  "About",
  "Why FY Devs exists: bespoke websites clients are proud of, honest pricing, and software that solves real problems.",
);

const beliefs = [
  ["Bespoke over generic", "Your business isn't a template, so your website shouldn't be one either."],
  ["Clarity over friction", "Services, prices and next steps should be easy to understand before you pick up the phone."],
  ["Outcomes over output", "Credibility, enquiries, bookings and smoother operations matter more than page counts."],
  ["Premium, but approachable", "High standards without a complicated sales process or jargon."],
  ["Purposeful technology", "We build features that solve real problems, and say so when something isn't needed."],
  ["Practical delivery", "Start focused, launch well, and expand when there's a reason to."],
];

const standards = [
  ["Accessible", "Semantic markup, keyboard support, visible focus and sufficient contrast, aiming for WCAG 2.2 AA."],
  ["Fast", "Lean pages, optimised images and as little JavaScript as the job needs."],
  ["Secure", "Input validated on the server, secrets kept out of the browser, and prices recalculated server-side."],
  ["Maintainable", "Clear structure and shared design tokens, so the next change is as careful as the first."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`About ${site.name}`}
        title="A small studio with exacting standards."
        lede={`${site.name} builds digital work businesses are proud to show their customers, and makes buying it straightforward.`}
      />

      <section className="section section--ruled">
        <div className="container container--wide">
          <div className="split">
            <div className="prose">
              <p className="statement">
                Cheap templates, or agencies that take weeks to quote. <em>We think there&apos;s a better way.</em>
              </p>
              <p className="muted">
                {site.name} combines bespoke web design with custom development and booking software. On the website
                side, that means considered design, careful engineering and prices you can see before you commit. On
                the software side, it means tools built around real operations, like the driver and operator software
                we developed for EV Exec, and FYStay, the holiday stays platform we run ourselves.
              </p>
              <p className="muted">
                We&apos;re deliberately not competing in the template market. Every site we&apos;ve built looks and
                works differently, because every business we&apos;ve built for is different.
              </p>
            </div>
            <div className="about-phones" aria-label="A selection of our work">
              {projects.map((p) => (
                <PhoneFrame key={p.slug} src={p.mobile} alt={`The ${p.name} website on a phone`} sizes="160px" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="Principles" title="What guides the work." />
          <ol role="list" className="ruled-list">
            {beliefs.map(([title, body], i) => (
              <li key={title}>
                <span className="ruled-list__num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{title}</h3>
                <p className="muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section inverse">
        <div className="container container--wide">
          <SectionHead eyebrow="Engineering standards" title="The parts you don't see." split>
            <p>Every project, large or small, is built to the same baseline.</p>
          </SectionHead>
          <div className="grid-2" style={{ rowGap: "var(--space-7)" }}>
            {standards.map(([title, body]) => (
              <div key={title} className="feature">
                <h3 className="h3">{title}</h3>
                <p className="muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Let's build something you're proud of.">
        <Link href="/contact?topic=website" className="btn btn--primary">
          Start a Project
        </Link>
        <Link href="/contact?topic=bespoke" className="btn btn--secondary">
          Build My SaaS
        </Link>
      </CtaBand>
    </>
  );
}
