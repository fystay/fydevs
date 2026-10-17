import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/Blocks";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata(
  "/about",
  "About",
  "Why FY Devs exists: bespoke websites clients are proud of, honest pricing, and software that solves real problems.",
);

const beliefs = [
  ["Bespoke over generic", "Your business isn't a template, so your website shouldn't be one either."],
  ["Clarity over friction", "Services, prices and next steps should be easy to understand before you pick up the phone."],
  ["Outcomes over output", "Credibility, enquiries, sales and smoother operations matter more than page counts."],
  ["Premium, but approachable", "High standards without a complicated sales process or jargon."],
  ["Purposeful technology", "We build features that solve real problems, and say so when something isn't needed."],
  ["Practical delivery", "Start focused, launch well, and expand when there's a reason to."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`About ${site.name}`}
        title="Websites you're proud of. Software that earns its place."
        lede={`${site.name} exists to build digital work that businesses are genuinely proud to show customers, and to make buying it straightforward.`}
      />

      <section className="section section--ruled">
        <div className="container container--wide">
          <div className="prose">
            <p className="lede" style={{ maxWidth: "none" }}>
              Too many businesses end up with one of two options: a cheap template that looks like everyone
              else&apos;s, or an agency process that takes weeks to produce a quote. We think there&apos;s a better way.
            </p>
            <p className="muted">
              {site.name} combines bespoke web design with custom development and booking software. On the website
              side, that means considered design, careful engineering and prices you can see before you commit. On the
              software side, it means tools built around real operations, starting with an application developed for
              an airport taxi business.
            </p>
            <p className="muted">
              We&apos;re deliberately not competing in the cheap, template-based market. Our focus is on work that
              reflects the quality of the businesses we build for, delivered without unnecessary back-and-forth.
            </p>
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

      <CtaBand title="Let's build something you're proud of.">
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
