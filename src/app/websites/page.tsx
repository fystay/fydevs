import Link from "next/link";
import { CtaBand, PageHero, PricingNotice, SectionHead } from "@/components/Blocks";
import { BrowserFrame } from "@/components/Devices";
import { ArrowRight } from "@/components/Icons";
import { PlanSwiper } from "@/components/interactive/PlanSwiper";
import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { carePlanCards } from "@/lib/plans";
import { PACKAGES, formatGBP, type PackageId } from "@/lib/pricing";

export const metadata = pageMetadata(
  "/websites",
  "Bespoke websites",
  "Bespoke website design and development with clear packages, transparent starting prices and optional hosting and care plans.",
);

const services = [
  {
    title: "Design",
    body: "A visual direction built from your brand and your customers, not a theme. Typography, layout and imagery chosen to suit what you sell.",
  },
  {
    title: "Development",
    body: "Hand-built, responsive front ends that load quickly and work with a keyboard, a screen reader and a slow connection.",
  },
  {
    title: "Content management",
    body: "Where it's useful, an editing experience that lets you update pages and posts without calling a developer.",
  },
  {
    title: "Search foundations",
    body: "Clean markup, metadata, sitemaps and sensible page structure, so search engines can understand your site from day one.",
  },
  {
    title: "Functionality",
    body: "Enquiry forms, payments, bookings and integrations, added when they serve a real purpose and scoped clearly when they're complex.",
  },
  {
    title: "Modernisation",
    body: "Rebuilding an existing site that has become slow, dated or hard to update, keeping what works and replacing what doesn't.",
  },
];

const packageOrder: PackageId[] = ["essential", "professional", "premium"];

const costRows: [string, string][] = [
  ["Domain registration and renewal", "Charged separately, or registered in your name"],
  ["Business email", "Charged separately by your email provider"],
  ["Paid plugins, fonts and software licences", "Charged separately, agreed in advance"],
  ["Third-party subscriptions and usage fees", "Paid directly to the provider"],
  ["Major new features after launch", "Quoted as separate work"],
  ["Work beyond a plan's monthly allowance", "Quoted before it starts"],
];

export default function WebsitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Websites"
        title="Bespoke websites, priced in the open."
        lede="We design and build websites that reflect the quality of your business, and we tell you what they cost before you've had to ask."
      >
        <div className="btn-row">
          <Link href="/build" className="btn btn--primary">
            Configure your website
            <ArrowRight />
          </Link>
          <Link href="#packages" className="btn btn--secondary">
            See packages
          </Link>
        </div>
      </PageHero>

      <section className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="What we do" title="Everything a serious website needs." split>
            <p>
              Every project includes design and development. The rest depends on what your business needs, and the
              configurator only asks about what&apos;s relevant.
            </p>
          </SectionHead>
          <div className="grid-3" style={{ rowGap: "var(--space-7)" }}>
            {services.map((s) => (
              <div key={s.title} className="feature">
                <h3 className="h3">{s.title}</h3>
                <p className="muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="examples-title">
        <div className="container container--wide">
          <SectionHead eyebrow="Recent websites" title={<span id="examples-title">Three clients, three identities.</span>} split>
            <p>
              The same standards underneath, and a completely different face on top. Each design starts from the
              business and the people it serves.
            </p>
          </SectionHead>
          <div className="site-strip">
            {projects
              .filter((p) => p.kind === "client")
              .map((p) => (
                <Link key={p.slug} href={`/work#${p.slug}`}>
                  <div>
                    <BrowserFrame
                      src={p.desktop}
                      host={p.host}
                      alt={`The ${p.name} website`}
                      sizes="(min-width: 48rem) 420px, 90vw"
                    />
                  </div>
                  <p>
                    <strong>{p.name}</strong>
                    <span>{p.sector}</span>
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section id="packages" className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="Packages" title="Defined deliverables, clear limits." split>
            <p>
              Packages are starting points. The configurator recommends one based on your answers and adds any extras
              you choose, so you can see exactly where the price comes from.
            </p>
          </SectionHead>
          <div className="grid-3">
            {packageOrder.map((id) => {
              const pkg = PACKAGES[id];
              return (
                <div key={id} className={`card package${id === "professional" ? " package--featured" : ""}`}>
                  <div className="stack" style={{ "--stack": "var(--space-2)" } as React.CSSProperties}>
                    <h3 className="h3">{pkg.name}</h3>
                    <p className="muted small">{pkg.summary}</p>
                  </div>
                  <p className="package__price">
                    <span className="fine">From</span>
                    <strong>{formatGBP(pkg.from)}</strong>
                  </p>
                  <ul role="list" className="checks">
                    {pkg.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-6" style={{ display: "grid", gap: "var(--space-5)" }}>
            <PricingNotice />
            <p className="muted small">
              Complex projects, such as sites over 25 pages, customer accounts or custom integrations, are scoped on a
              short call before we confirm a price. We never take payment for work we haven&apos;t agreed in detail.
            </p>
          </div>
        </div>
      </section>

      <section id="care" className="section section--ruled">
        <div className="container container--wide">
          <SectionHead eyebrow="Hosting & care" title="Ongoing costs, kept separate." split>
            <p>
              One-off build fees and monthly plans are always priced separately. Plans are optional: you can host the
              site yourself after handover.
            </p>
          </SectionHead>
        </div>

        <div data-reveal>
          <PlanSwiper plans={carePlanCards} initial="care" label="Hosting and care plans" />
        </div>

        <div className="container container--wide">
          <h3 className="h3 mt-8">What&apos;s not included in any plan</h3>
          <p className="muted small mt-4" style={{ maxWidth: "40rem" }}>
            These costs depend on choices you make and the services you use. We&apos;ll always tell you about them
            up front.
          </p>
          <div className="table-wrap mt-5" role="region" aria-label="Costs not included in any plan" tabIndex={0}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">How it&apos;s handled</th>
                </tr>
              </thead>
              <tbody>
                {costRows.map(([item, how]) => (
                  <tr key={item}>
                    <th scope="row">{item}</th>
                    <td className="muted">{how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <PricingNotice />
          </div>
        </div>
      </section>

      <CtaBand
        title="See what your website would cost."
        body="Nine short steps, an instant indicative estimate, and a summary you can send us when you're ready."
      >
        <Link href="/contact?topic=website" className="btn btn--primary">
          Start a Project
        </Link>
        <Link href="/build" className="btn btn--secondary">
          Get an instant estimate
        </Link>
      </CtaBand>
    </>
  );
}
