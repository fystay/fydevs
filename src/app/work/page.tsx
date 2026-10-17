import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/Blocks";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";

export const metadata = pageMetadata(
  "/work",
  "Our work",
  "Selected FY Devs projects: the problem, the solution and verified outcomes.",
);

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Selected projects."
        lede="Each case study sets out the client's problem, what we built and the outcomes we can verify."
      />
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          {projects.length === 0 ? (
            <div className="card stack" style={{ maxWidth: "44rem", "--stack": "var(--space-4)" } as React.CSSProperties}>
              <h2 className="h3">Case studies are being prepared.</h2>
              <p className="muted">
                We only publish projects with our clients&apos; permission and outcomes we can stand behind, so this
                page is growing carefully. In the meantime, our first product, booking software developed for an
                airport taxi business, is available to see on a demo.
              </p>
              <div className="btn-row">
                <Link href="/booking-software" className="arrow-link">
                  Booking software <ArrowRight />
                </Link>
                <Link href="/contact" className="arrow-link">
                  Ask about our work <ArrowRight />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid-2">
              {projects.map((p) => (
                <article key={p.slug} className="card stack" style={{ "--stack": "var(--space-4)" } as React.CSSProperties}>
                  {p.image && (
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      width={p.image.width}
                      height={p.image.height}
                      sizes="(min-width: 48rem) 50vw, 100vw"
                      style={{ borderRadius: "var(--radius-md)" }}
                    />
                  )}
                  <p className="eyebrow">{p.sector}</p>
                  <h2 className="h3">{p.name}</h2>
                  <p className="muted">{p.summary}</p>
                  <dl className="small stack">
                    <dt className="fine">The problem</dt>
                    <dd>{p.problem}</dd>
                    <dt className="fine">What we built</dt>
                    <dd>{p.solution}</dd>
                  </dl>
                  {p.outcomes.length > 0 && (
                    <ul role="list" className="checks">
                      {p.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  )}
                  {p.url && (
                    <a href={p.url} className="arrow-link" target="_blank" rel="noopener noreferrer">
                      Visit the site <ArrowRight />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
