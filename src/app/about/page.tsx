import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/Blocks";
import { PhoneFrame } from "@/components/Devices";
import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { Stopwatch } from "@/components/Icons";

export const metadata = pageMetadata(
  "/about",
  "About",
  "Why FY Devs exists: bespoke websites clients are proud of, honest pricing, and apps that solve real problems.",
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
  ["Accessible", "Semantic markup, keyboard support, visible focus and sufficient contrast, aiming for WCAG 2.2 AA.", "a11y"],
  ["Fast", "Lean pages, optimised images and as little JavaScript as the job needs.", "fast"],
  ["Secure", "Input validated on the server, secrets kept out of the browser, and prices recalculated server-side.", "secure"],
  ["Maintainable", "Clear structure and shared design tokens, so the next change is as careful as the first.", "tokens"],
] as const;

/** A small picture of each standard, drawn in code (decorative: the text says it all). */
function StandardDemo({ kind }: { kind: (typeof standards)[number][2] }) {
  if (kind === "a11y")
    return (
      <span className="std std--a11y">
        <kbd>Tab</kbd>
        <span className="std__arrow" />
        <span className="std__btn">Get my price</span>
      </span>
    );
  if (kind === "fast")
    return (
      <span className="std std--fast">
        <span className="std__page">
          <i style={{ width: "60%" }} />
          <i style={{ width: "90%", height: "2.2em" }} />
          <i style={{ width: "75%" }} />
        </span>
        <span className="std__tick">✓</span>
      </span>
    );
  if (kind === "secure")
    return (
      <span className="std std--secure">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="10.5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="std__pill">Price checked on the server</span>
      </span>
    );
  return (
    <span className="std std--tokens">
      {["#d45b32", "#56624a", "#2f5d62", "#f2ece2", "#1c1c1c"].map((c) => (
        <i key={c} style={{ background: c }} />
      ))}
    </span>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`About ${site.name}`}
        title={<>A small studio with <span className="serif-em">exacting standards.</span></>}
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
                {site.name} combines bespoke web design with app development and booking software. On the website
                side, that means considered design, careful engineering and prices you can see before you commit. On
                the app side, it means tools built around real operations, like the driver and operator apps we
                developed for EV Exec, and FYStay, the holiday stays platform we run ourselves.
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
          <SectionHead eyebrow="Principles" title={<>What <span className="serif-em">guides the work.</span></>} />
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
          <SectionHead eyebrow="Engineering standards" title={<>The parts <span className="serif-em">you don&apos;t see.</span></>} split>
            <p>Every project, large or small, is built to the same baseline.</p>
          </SectionHead>
          <div className="grid-2" style={{ rowGap: "var(--space-7)" }}>
            {standards.map(([title, body, kind]) => (
              <div key={title} className="feature">
                <div className="feature__demo" aria-hidden="true">
                  <StandardDemo kind={kind} />
                </div>
                <h3 className="h3">{title}</h3>
                <p className="muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={<>Let&apos;s build something <span className="serif-em">you&apos;re proud of.</span></>}>
        <Link href="/build" className="btn btn--primary">
          <Stopwatch />
          Get my price
        </Link>
        <Link href="/contact" className="btn btn--secondary">
          Talk to us
        </Link>
      </CtaBand>
    </>
  );
}
