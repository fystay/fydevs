"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  DEFAULT_ANSWERS,
  PACKAGES,
  PRICING_STATUS,
  estimate,
  formatGBP,
  type PageBand,
  type ProjectType,
} from "@/lib/pricing";
import { ArrowRight } from "../Icons";
import styles from "./QuickEstimate.module.css";

const TYPES: [ProjectType, string][] = [
  ["business", "Business"],
  ["portfolio", "Portfolio"],
  ["shop", "Online shop"],
  ["booking", "Booking"],
];
const BANDS: [PageBand, string][] = [
  ["1-5", "Up to 5"],
  ["6-12", "6 to 12"],
  ["13-25", "13 to 25"],
];

/** A two-question taste of the configurator, priced by the same rules. */
export function QuickEstimate() {
  const id = useId();
  const [projectType, setProjectType] = useState<ProjectType>("business");
  const [pageBand, setPageBand] = useState<PageBand>("1-5");
  const result = estimate({ ...DEFAULT_ANSWERS, projectType, pageBand, carePlan: "none" });
  const query = new URLSearchParams({ type: projectType, pages: pageBand }).toString();

  return (
    <div className={`card card--raised ${styles.card}`}>
      <div className={styles.head}>
        <p className="eyebrow">Instant estimate</p>
        {PRICING_STATUS === "provisional" && <span className={styles.badge}>Provisional</span>}
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>What are you building?</legend>
        <div className={styles.options}>
          {TYPES.map(([t, label]) => (
            <label key={t} className={styles.option}>
              <input
                type="radio"
                name={`${id}-type`}
                value={t}
                checked={projectType === t}
                onChange={() => setProjectType(t)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>How many pages?</legend>
        <div className={styles.options}>
          {BANDS.map(([b, label]) => (
            <label key={b} className={styles.option}>
              <input
                type="radio"
                name={`${id}-pages`}
                value={b}
                checked={pageBand === b}
                onChange={() => setPageBand(b)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.result} aria-live="polite">
        <p className="fine">Indicative build, {PACKAGES[result.packageId].name} package</p>
        <p className={styles.price}>
          {formatGBP(result.range.low)}
          <span> to {formatGBP(result.range.high)}</span>
        </p>
      </div>

      <Link href={`/build?${query}`} className="btn btn--primary">
        Refine in the full configurator
        <ArrowRight />
      </Link>
      <p className="fine">Excludes VAT and ongoing hosting. No sign-up needed.</p>
    </div>
  );
}
