import type {
  AddOn,
  ComparisonRow,
  FAQ,
  PricingTier,
  SectionHeaderConfig,
} from "@/client/types";

export const PRICING_HEADER: SectionHeaderConfig = {
  badge: "Transparent pricing",
  title: "Investment that pays off.",
  subtitle:
    "Clear starting prices, fixed-scope quotes, and a written proposal before a line of code.",
} as const;

export const PRICING_TIERS: readonly PricingTier[] = [
  {
    id: "starter",
    name: "Starter website",
    priceUsd: 2500,
    priceLabel: "from",
    description:
      "A polished, fast site to establish credibility and capture leads.",
    features: [
      "Up to 5 pages",
      "Mobile-first design",
      "Basic SEO setup",
      "Contact + lead capture",
      "30 days post-launch support",
    ],
    isPopular: false,
    ctaLabel: "Get a quote",
    ctaHref: "/contact",
  },
  {
    id: "business",
    name: "Business & e-commerce",
    priceUsd: 3500,
    priceLabel: "from",
    description:
      "A conversion-focused site or online store built to grow revenue.",
    features: [
      "Custom design system",
      "Shopify or headless CMS",
      "Advanced SEO + schema",
      "Integrations & automation",
      "90 days post-launch support",
    ],
    isPopular: true,
    ctaLabel: "Get a quote",
    ctaHref: "/contact",
  },
  {
    id: "custom",
    name: "Custom & Plus",
    priceUsd: 7500,
    priceLabel: "from",
    description: "Custom web apps and Plus builds with deep functionality.",
    features: [
      "Custom development",
      "Portals & dashboards",
      "API integrations",
      "SSO & audit logging",
      "Ongoing partnership",
    ],
    isPopular: false,
    ctaLabel: "Get a quote",
    ctaHref: "/contact",
  },
] as const;

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    id: "pages",
    feature: "Pages / screens",
    values: ["Up to 5", "Up to 15", "Unlimited"],
  },
  {
    id: "design-system",
    feature: "Custom design system",
    values: [false, true, true],
  },
  {
    id: "ecommerce",
    feature: "E-commerce / checkout",
    values: [false, true, true],
  },
  {
    id: "accounts",
    feature: "User accounts & roles",
    values: [false, "Basic", "SSO + RBAC"],
  },
  {
    id: "integrations",
    feature: "Third-party integrations",
    values: [false, "Up to 3", "Unlimited"],
  },
  {
    id: "seo",
    feature: "SEO & schema",
    values: ["Basic", "Advanced", "Advanced"],
  },
  {
    id: "monitoring",
    feature: "Monitoring & alerting",
    values: [false, true, true],
  },
  {
    id: "support",
    feature: "Post-launch support",
    values: ["30 days", "90 days", "12 months"],
  },
] as const;

export const ADD_ONS: readonly AddOn[] = [
  {
    id: "brand",
    priceUsd: 900,
    title: "Brand identity",
    description: "Logo, palette, type and usage guide.",
  },
  {
    id: "seo-sprint",
    priceUsd: 1200,
    title: "SEO sprint",
    description: "Technical audit, fixes and a 90-day plan.",
  },
  {
    id: "care",
    priceUsd: 600,
    unit: "/mo",
    title: "Care plan",
    description: "Updates, backups, uptime and a support inbox.",
  },
  {
    id: "mobile-shell",
    priceUsd: 2400,
    title: "Mobile app shell",
    description: "iOS + Android wrapper with push and store setup.",
  },
] as const;

export const PRICING_FAQS: readonly FAQ[] = [
  {
    id: "from-prices",
    question: "Why are these starting prices?",
    answer:
      "Because quoting a flat number for work we have not scoped would be guessing. The floor is real — most Business projects land between $3,500 and $6,000.",
  },
  {
    id: "payments",
    question: "How do payments work?",
    answer:
      "Half to start, half on launch, for projects under $10k. Larger builds are billed against milestones you sign off on.",
  },
  {
    id: "changes",
    question: "What if we need changes later?",
    answer:
      "Small changes are covered by your support window. Anything larger gets its own small fixed-price scope — no open-ended hourly billing.",
  },
  {
    id: "equity",
    question: "Do you take equity instead?",
    answer:
      "Occasionally, as part of a blended deal for products we would use ourselves. Ask on the call — the answer is usually no, but it is worth asking.",
  },
] as const;
