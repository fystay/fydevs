import Link from "next/link";
import { CtaBand, PageHero, SectionHead } from "@/components/Blocks";
import { BrowserFrame } from "@/components/Devices";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";
import { projectBySlug } from "@/lib/projects";

const evexec = projectBySlug("ev-exec")!;
const fystay = projectBySlug("fystay")!;

export const metadata = pageMetadata(
  "/app-development",
  "App development",
  "Bespoke web and mobile apps, customer portals, internal tools and integrations, scoped carefully and built around the way your business operates.",
);

const capabilities = [
  {
    title: "Web and mobile apps",
    body: "Apps your customers or your team use every day, on their phones and at their desks, shaped around the tasks they actually do.",
  },
  {
    title: "Integrations",
    body: "Connecting the tools you already rely on, such as payment providers, calendars, CRMs and accounting software, so data moves without retyping.",
  },
  {
    title: "Internal tools",
    body: "Focused apps that replace spreadsheets, paper and workarounds with something your team actually wants to use.",
  },
  {
    title: "Customer portals",
    body: "Accounts where your customers book, pay, track and manage things themselves, with permissions and data handled carefully.",
  },
];

const steps = [
  ["Discovery", "We learn how your business works today, where the friction is and what success would look like."],
  ["Scope", "A written scope: what will be built, what won't, the assumptions, the price and the payment schedule."],
  ["Design", "Workflows and interfaces designed with the people who'll use them, before development starts."],
  ["Build in stages", "A working app delivered in agreed stages, so you can see progress and give feedback early."],
  ["Launch and support", "Careful roll-out, data migration where needed, and ongoing support on terms agreed in advance."],
];

export default function AppDevelopmentPage() {
  return (
    <>
      <PageHero
        service="apps"
        eyebrow="App development"
        title={<>Apps, <span className="serif-em">built around how you work.</span></>}
        lede="When off-the-shelf tools don't fit, we design and build apps around how your business actually works, and agree the scope in writing before you commit."
      >
        <div className="btn-row">
          <Link href="/contact?topic=bespoke" className="btn btn--primary">
            Build My App
            <ArrowRight />
          </Link>
        </div>
      </PageHero>

      <section className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="Capabilities" title={<>What <span className="serif-em">we build.</span></>} />
          <div className="grid-2" style={{ rowGap: "var(--space-7)" }}>
            {capabilities.map((c) => (
              <div key={c.title} className="feature">
                <h3 className="h3">{c.title}</h3>
                <p className="muted">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="section inverse" aria-labelledby="examples-title">
        <div className="container container--wide">
          <SectionHead eyebrow="From our work" title={<span id="examples-title">Apps we&apos;ve <span className="serif-em">already built.</span></span>} split>
            <p>Two real examples, both designed and built by FY Devs.</p>
          </SectionHead>
          <div className="grid-2" style={{ gap: "var(--space-7)" }}>
            {[
              {
                p: evexec,
                title: "Airport transfer booking",
                body: "A three-step booking flow with returns, extra stops and flight details, customer accounts, plus driver and operator apps behind it.",
                href: "/booking-software",
                link: "About the booking software",
              },
              {
                p: fystay,
                title: "A holiday stays platform",
                body: "Stay search, town guides, host listings with a host dashboard, and airport transfers that can be added to a confirmed booking.",
                href: "/work#fystay",
                link: "About FYStay",
              },
            ].map((ex) => (
              <article key={ex.p.slug} className="stack" style={{ "--stack": "var(--space-5)" } as React.CSSProperties}>
                <div className="media-panel">
                  <BrowserFrame
                    src={ex.p.desktop}
                    host={ex.p.host}
                    alt={`The ${ex.p.name} website`}
                    sizes="(min-width: 48rem) 560px, 90vw"
                  />
                </div>
                <p className="eyebrow">{ex.p.name}</p>
                <h3 className="h3">{ex.title}</h3>
                <p className="muted">{ex.body}</p>
                <p>
                  <Link href={ex.href} className="arrow-link">
                    {ex.link} <ArrowRight />
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="Process" title={<>Scope first, <span className="serif-em">then build.</span></>} split>
            <p>
              App work is never priced from a form. We confirm scope, assumptions, exclusions and the final price
              before asking for any commitment.
            </p>
          </SectionHead>
          <ol role="list" className="ruled-list">
            {steps.map(([title, body], i) => (
              <li key={title}>
                <span className="ruled-list__num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{title}</h3>
                <p className="muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section--tight">
        <div className="container container--wide">
          <div className="notice">
            <span>
              <strong>Running a taxi or transfer business?</strong> Our{" "}
              <Link href="/booking-software">booking software</Link> may already do what you need, without the cost of
              a bespoke build.
            </span>
          </div>
        </div>
      </section>

      <CtaBand
        title={<>Tell us how your <span className="serif-em">business runs.</span></>}
        body="A short description of what you do and what isn't working is enough to start."
      >
        <Link href="/contact?topic=bespoke" className="btn btn--primary">
          Build My App
        </Link>
      </CtaBand>
    </>
  );
}
