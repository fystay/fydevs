import { Suspense } from "react";
import { PageHero } from "@/components/Blocks";
import { Configurator } from "@/components/configurator/Configurator";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/build",
  "Build your website",
  "Configure your website in a few steps and see an indicative price immediately, with inclusions, exclusions and ongoing costs set out clearly.",
);

const loading = <p className="muted">Loading the configurator…</p>;

export default function BuildPage() {
  return (
    <>
      <PageHero
        eyebrow="Website configurator"
        title="Build your website."
        lede="Answer a few short questions and watch the estimate update as you go. You can change any answer before sending, and nothing is charged at this stage."
      />
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          <Suspense fallback={loading}>
            <Configurator fallback={loading} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
