import type { HeroData, Metric } from "@/client/types";

export const HERO_DATA: HeroData = {
  badgeTag: "NEW",
  badgeText: "Frostboard 2.0 — our scheduling SaaS is live",
  headlineLead: "Software with the ",
  headlineIce: "clarity of ice",
  headlineMid: ", engineered to ",
  headlineForest: "grow",
  headlineTail: ".",
  description:
    "FrostWoodTech builds SaaS products and custom client platforms — precise where it counts, fast where it matters, and built to last.",
  primaryCta: {
    label: "Book a discovery call",
    href: "/contact",
  },
  secondaryCta: {
    label: "Explore our work",
    href: "/work",
  },
  trustLine:
    "Fixed-scope proposals · No retainers required · Ships in weeks, not quarters",
} as const;

/** Logo row under the hero. Replace the brackets with real client marks. */
export const TRUSTED_BY: readonly string[] = [
  "[CLIENT 1]",
  "[CLIENT 2]",
  "[CLIENT 3]",
  "[CLIENT 4]",
  "[CLIENT 5]",
] as const;

export const HOME_METRICS: readonly Metric[] = [
  {
    id: "shipped",
    value: "40",
    suffix: "+",
    suffixTone: "forest",
    label: "Products & platforms shipped",
  },
  {
    id: "retention",
    value: "98",
    suffix: "%",
    suffixTone: "forest",
    label: "Clients who come back",
  },
  {
    id: "uptime",
    value: "99.98",
    suffix: "%",
    suffixTone: "ice",
    label: "SaaS uptime, trailing 90 days",
  },
  {
    id: "time-to-release",
    value: "6",
    suffix: "wk",
    suffixTone: "ice",
    label: "Median time to first release",
  },
] as const;
