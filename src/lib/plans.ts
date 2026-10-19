import type { PlanCard } from "@/components/interactive/PlanSwiper";
import { CARE_PLANS, formatGBP, type CarePlan } from "./pricing";

const careOrder: CarePlan[] = ["hosting", "care", "carePlus"];

/** Hosting and care plans as selectable cards; each opens the configurator with that plan chosen. */
export const carePlanCards: PlanCard[] = careOrder.map((id) => ({
  id,
  name: CARE_PLANS[id].label,
  summary: CARE_PLANS[id].summary,
  price: formatGBP(CARE_PLANS[id].monthly),
  suffix: "/month",
  includes: CARE_PLANS[id].includes,
  href: `/build?care=${id}`,
  cta: `Choose ${CARE_PLANS[id].label}`,
}));
