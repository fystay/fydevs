import Link from "next/link";
import { PageHero } from "@/components/Blocks";

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title="This page doesn't exist." lede="It may have moved, or the link may be mistyped.">
      <div className="btn-row">
        <Link href="/" className="btn btn--primary">
          Go to the homepage
        </Link>
        <Link href="/contact" className="btn btn--secondary">
          Contact us
        </Link>
      </div>
    </PageHero>
  );
}
