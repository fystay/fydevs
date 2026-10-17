import Link from "next/link";
import { CtaBand, PageHero } from "@/components/Blocks";
import { BrowserFrame, PhoneFrame } from "@/components/Devices";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";

export const metadata = pageMetadata(
  "/work",
  "Our work",
  "Websites and platforms designed and built by FY Devs: EV Exec, Boonma, FYStay and Alex K Bells.",
);

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Every site built for the business it serves."
        lede="A transfer company, a massage studio, a kettlebell coach and our own holiday platform. Different customers, so different identities, structures and features."
      />

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          <div className="work-list">
            {projects.map((p, i) => (
              <article
                key={p.slug}
                id={p.slug}
                className={`work-row${i % 2 === 1 ? " work-row--flip" : ""}`}
                aria-labelledby={`${p.slug}-title`}
              >
                <div className="work-row__media">
                  <BrowserFrame
                    src={p.desktop}
                    host={p.host}
                    alt={`The ${p.name} website on desktop`}
                    sizes="(min-width: 80rem) 680px, (min-width: 64rem) 55vw, 90vw"
                    preload={i === 0}
                  />
                  <PhoneFrame
                    className="work-row__phone"
                    src={p.mobile}
                    alt={`The ${p.name} website on a phone`}
                    sizes="(min-width: 64rem) 170px, 22vw"
                  />
                </div>
                <div className="work-row__text">
                  <p className="work-row__meta">
                    <span>{p.sector}</span>
                    <span>{p.location}</span>
                  </p>
                  <h2 id={`${p.slug}-title`} className="h2">
                    {p.name}
                  </h2>
                  <div>
                    <span className={`tag${p.kind === "product" ? " tag--accent" : ""}`}>
                      {p.kind === "product" ? "Our own platform" : "Client website"}
                    </span>
                  </div>
                  <p className="muted">{p.summary}</p>
                  <ul role="list" className="checks">
                    {p.built.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="fine">Identity: {p.identity}</p>
                  <p>
                    <a href={p.url} className="arrow-link" target="_blank" rel="noopener noreferrer">
                      Visit {p.host}
                      <ArrowRight />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </p>
                  {p.slug === "ev-exec" && (
                    <p className="small muted">
                      We also developed the driver and operator software behind EV Exec.{" "}
                      <Link href="/booking-software">About the booking software</Link>.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Your business, its own website." body="Configure your project for an instant estimate.">
        <Link href="/build" className="btn btn--primary">
          Build your website
        </Link>
        <Link href="/contact" className="btn btn--secondary">
          Ask about our work
        </Link>
      </CtaBand>
    </>
  );
}
