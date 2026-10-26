import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/Blocks";
import { PhoneFrame } from "@/components/Devices";
import { ScrollShot } from "@/components/interactive/ScrollShot";
import { Tilt } from "@/components/interactive/Tilt";
import { ArrowRight, Stopwatch } from "@/components/Icons";
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
        title={<>Case <span className="serif-em">studies.</span></>}
        lede="Four live projects: three client websites and our own platform. For each one, the challenge, how we approached it and exactly what we built, with real desktop and mobile screenshots."
      />

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          <div className="work-list">
            {projects.map((p, i) => (
              <article
                key={p.slug}
                id={p.slug}
                className={`work-row${i % 2 === 1 ? " work-row--flip" : ""}`}
                data-reveal
                aria-labelledby={`${p.slug}-title`}
              >
                <Tilt max={3}>
                  <div className="work-row__media scroll-trigger" role="group" tabIndex={0} aria-label={`${p.name}: focus to scroll the full page`}>
                    <ScrollShot
                      src={p.page}
                      host={p.host}
                      alt={`The ${p.name} website, full page`}
                      sizes="(min-width: 80rem) 760px, (min-width: 64rem) 60vw, 100vw"
                    />
                    <PhoneFrame
                      className="work-row__phone"
                      src={p.mobile}
                      alt={`The ${p.name} website on a phone`}
                      sizes="(min-width: 64rem) 170px, 22vw"
                    />
                  </div>
                </Tilt>
                <div className="work-row__text">
                  <p className="work-row__meta">
                    <span>{p.sector}</span>
                    <span>{p.location}</span>
                  </p>
                  <h2 id={`${p.slug}-title`} className="h2 work-row__title">
                    <Image src={p.logo} alt="" width={44} height={44} sizes="44px" className="work-row__logo" />
                    {p.name}
                  </h2>
                  <div>
                    <span className={`tag${p.kind === "product" ? " tag--accent" : ""}`}>
                      {p.kind === "product" ? "Our own platform" : "Client website"}
                    </span>
                  </div>
                  <p className="muted">{p.summary}</p>
                  <dl className="case">
                    <div>
                      <dt>The challenge</dt>
                      <dd>{p.challenge}</dd>
                    </div>
                    <div>
                      <dt>Our solution</dt>
                      <dd>{p.solution}</dd>
                    </div>
                    <div>
                      <dt>What we built</dt>
                      <dd>
                        <ul role="list" className="checks">
                          {p.built.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                  <p>
                    <a href={p.url} className="btn btn--secondary btn--sm" target="_blank" rel="noopener noreferrer">
                      Visit the live site
                      <ArrowRight />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </p>
                  {p.slug === "ev-exec" && (
                    <p className="small muted">
                      We also developed the driver and operator apps behind EV Exec.{" "}
                      <Link href="/booking-software">About the booking software</Link>.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={<>Your business <span className="serif-em">could be next.</span></>}
        body="Tell us what you need. We reply with honest advice, a clear price and a plan."
      >
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
