import Link from "next/link";
import { CtaBand, PageHero } from "@/components/Blocks";
import { Faq } from "@/components/Faq";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/faq",
  "Questions",
  "Answers on timings, revisions, payments, ownership, support after launch and building software with FY Devs.",
);

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="serif-em">answered.</span>
          </>
        }
        lede={
          <>
            Anything else? <Link href="/contact?topic=other">Ask us directly</Link>.
          </>
        }
      />
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container container--wide" style={{ maxWidth: "52rem" }}>
          <Faq />
        </div>
      </section>
      <CtaBand
        title={
          <>
            Ready to <span className="serif-em">start?</span>
          </>
        }
        body="Tell us what you need. Honest advice and a clear next step."
      >
        <Link href="/contact?topic=website" className="btn btn--primary">
          Start a Project
        </Link>
        <Link href="/build" className="btn btn--secondary">
          Instant estimate
        </Link>
      </CtaBand>
    </>
  );
}
