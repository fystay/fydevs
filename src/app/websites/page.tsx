import Link from "next/link";
import { CtaBand, PageHero, PricingNotice, SectionHead } from "@/components/Blocks";
import { BrowserFrame } from "@/components/Devices";
import { ArrowRight } from "@/components/Icons";
import { PlanSwiper } from "@/components/interactive/PlanSwiper";
import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { carePlanCards, packagePlanCards } from "@/lib/plans";

export const metadata = pageMetadata(
  "/websites",
  "Bespoke websites",
  "Bespoke website design and development with clear packages, transparent starting prices and optional hosting and care plans.",
);

const services = [
  { title: "Design", body: "Built from your brand and customers, never a theme." },
  { title: "Development", body: "Hand-built, fast and accessible on every device." },
  { title: "Content management", body: "Update pages yourself, where it's useful." },
  { title: "Search foundations", body: "Clean structure search engines understand." },
  { title: "Functionality", body: "Forms, payments and bookings that serve a purpose." },
  { title: "Modernisation", body: "Rebuild a slow or dated site, keeping what works." },
];

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
        title={
          <>
            Bespoke websites, <span className="serif-em">priced in the open.</span>
          </>
        }
        lede="Websites that reflect the quality of your business, with the price on the page."
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
          <SectionHead
            eyebrow="What we do"
            title={
              <>
                Everything a serious <span className="serif-em">website needs.</span>
              </>
            }
            split
          >
            <p>Design and development in every project; the rest only if you need it.</p>
          </SectionHead>
          <div className="grid-3" style={{ rowGap: "var(--space-5)" }}>
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
          <SectionHead
            eyebrow="Recent websites"
            title={
              <span id="examples-title">
                Three clients, <span className="serif-em">three identities.</span>
              </span>
            }
            split
          >
            <p>The same standards underneath, a different face on top.</p>
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
          <SectionHead
            eyebrow="Packages"
            title={
              <>
                Defined deliverables, <span className="serif-em">clear limits.</span>
              </>
            }
            split
          >
            <p>
              Starting points. The <Link href="/build">configurator</Link> recommends one and shows where every pound
              comes from.
            </p>
          </SectionHead>
        </div>
        <div data-reveal>
          <PlanSwiper plans={packagePlanCards} initial="professional" label="Website packages" />
        </div>
        <div className="container container--wide">
          <div className="mt-6" style={{ display: "grid", gap: "var(--space-5)" }}>
            <PricingNotice />
            <p className="muted small">
              Over 25 pages, customer accounts or custom integrations? We scope it on a short call before confirming a
              price.
            </p>
          </div>
        </div>
      </section>

      <section id="care" className="section section--ruled">
        <div className="container container--wide">
          <SectionHead
            eyebrow="Hosting & care"
            title={
              <>
                Ongoing costs, <span className="serif-em">kept separate.</span>
              </>
            }
            split
          >
            <p>Optional monthly plans, priced separately. You can also host the site yourself.</p>
          </SectionHead>
        </div>

        <div data-reveal>
          <PlanSwiper plans={carePlanCards} initial="care" label="Hosting and care plans" />
        </div>

        <div className="container container--wide">
          <h3 className="h3 mt-8">What&apos;s not included in any plan</h3>
          <p className="muted small mt-4">Always flagged up front.</p>
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
        </div>
      </section>

      <CtaBand
        title={
          <>
            See what your website <span className="serif-em">would cost.</span>
          </>
        }
        body="Nine quick steps to an instant estimate you can send us."
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
