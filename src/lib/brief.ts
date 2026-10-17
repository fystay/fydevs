import {
  BRANDING_OPTIONS,
  CARE_PLANS,
  COPY_OPTIONS,
  DESIGN_LEVELS,
  FEATURES,
  IMAGERY_OPTIONS,
  PACKAGES,
  PAGE_BANDS,
  PRICING_STATUS,
  PROJECT_TYPES,
  TIMING_OPTIONS,
  VAT_NOTE,
  effectiveFeatures,
  estimate,
  formatGBP,
  type Answers,
} from "./pricing";

export type BriefDetails = { business: string; goals: string; launchDate: string };

export const EMPTY_DETAILS: BriefDetails = { business: "", goals: "", launchDate: "" };

/** Human-readable answers, in questionnaire order. Shared by the summary screen and the email. */
export function describeAnswers(answers: Answers, details: BriefDetails): [label: string, value: string][] {
  const features = effectiveFeatures(answers).map((f) => FEATURES[f].label);
  return [
    ["Project type", PROJECT_TYPES[answers.projectType].label],
    ["About the business", details.business || "Not given"],
    ["Goals", details.goals || "Not given"],
    ["Size", PAGE_BANDS[answers.pageBand].label],
    ["Copy", COPY_OPTIONS[answers.copy].label],
    ["Imagery", IMAGERY_OPTIONS[answers.imagery].label],
    ["Functionality", features.length ? features.join(", ") : "Enquiry form only"],
    ["Branding", BRANDING_OPTIONS[answers.branding].label],
    ["Design level", DESIGN_LEVELS[answers.designLevel].label],
    ["Hosting & care", CARE_PLANS[answers.carePlan].label],
    [
      "Timing",
      `${TIMING_OPTIONS[answers.timing].label}${answers.timing === "date" && details.launchDate ? `: ${details.launchDate}` : ""}`,
    ],
  ];
}

/** Plain-text brief including a freshly calculated estimate. */
export function formatBrief(answers: Answers, details: BriefDetails): string {
  const est = estimate(answers);
  return [
    "PROJECT BRIEF",
    ...describeAnswers(answers, details).map(([k, v]) => `${k}: ${v}`),
    "",
    `INDICATIVE ESTIMATE (${PRICING_STATUS} pricing)`,
    `Recommended package: ${PACKAGES[est.packageId].name}`,
    ...est.lineItems.map((item) => `  ${item.label}: ${formatGBP(item.amount)}`),
    `Build range: ${formatGBP(est.range.low)} to ${formatGBP(est.range.high)}`,
    `Monthly: ${est.monthly ? `${formatGBP(est.monthly)} (${CARE_PLANS[answers.carePlan].label})` : "None"}`,
    est.requiresScope
      ? `Scope confirmation needed:\n${est.scopeReasons.map((r) => `  - ${r}`).join("\n")}`
      : "Fits a fixed-scope package.",
    VAT_NOTE,
  ].join("\n");
}
