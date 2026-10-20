import Link from "next/link";
import { CtaBand, PageHero, PricingNotice, SectionHead } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { PlanSwiper } from "@/components/interactive/PlanSwiper";
import { pageMetadata } from "@/lib/metadata";
import { carePlanCards, packagePlanCards, saasPlanCard } from "@/lib/plans";

export const metadata = pageMetadata(
  "/pricing",
  "Pricing",
  "Starting prices for FY Devs websites, SaaS and bespoke software, and optional hosting and care plans.",
);

/** Every price in one place; the homepage links here rather than showing the cards. */
export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Clear prices. <span className="serif-em">No surprises.</span>
          </>
        }
        lede="Starting prices for bespoke work, confirmed in writing before you commit."
      >
        <div className="btn-row">
          <Link href="/build" className="btn btn--primary">
            Instant estimate
            <ArrowRight />
          </Link>
          <Link href="#care" className="btn btn--secondary">
            Hosting &amp; care
          </Link>
        </div>
      </PageHero>

      <section id="packages" className="section--tight" style={{ paddingTop: 0 }} aria-labelledby="packages-title">
        <h2 id="packages-title" className="visually-hidden">
          Websites and software
        </h2>
        <div data-reveal>
          <PlanSwiper plans={[...packagePlanCards, saasPlanCard]} initial="professional" label="Starting prices" />
        </div>
        <div className="container container--wide mt-6" style={{ display: "grid", gap: "var(--space-5)" }}>
          <PricingNotice />
          <p className="muted small">
            Over 25 pages, customer accounts or custom integrations? We scope it on a short call first.{" "}
            <Link href="/websites#packages">What each package includes in detail</Link>.
          </p>
        </div>
      </section>

      <section id="care" className="section section--ruled">
        <div className="container container--wide">
          <SectionHead
            eyebrow="After launch"
            title={
              <>
                Hosting and care, <span className="serif-em">priced separately.</span>
              </>
            }
            split
          >
            <p>
              Optional monthly plans. You can also host the site yourself.{" "}
              <Link href="/websites#care">What&apos;s not included</Link>.
            </p>
          </SectionHead>
        </div>
        <div data-reveal>
          <PlanSwiper plans={carePlanCards} initial="care" label="Hosting and care plans" />
        </div>
      </section>

      <CtaBand
        title={
          <>
            What would <span className="serif-em">yours cost?</span>
          </>
        }
        body="Nine quick steps to an instant estimate you can send us."
      >
        <Link href="/build" className="btn btn--primary">
          Instant estimate
        </Link>
        <Link href="/contact?topic=website" className="btn btn--secondary">
          Start a Project
        </Link>
      </CtaBand>
    </>
  );
}
