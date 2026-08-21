import type { PricingTier, SectionHeaderConfig } from "@/client/types";

export const PRICING_HEADER: SectionHeaderConfig = {
  badge: "Transparent Pricing",
  title: "Investment That\nPays Off",
  subtitle:
    "Clear starting prices and fixed-scope quotes — no surprises. Every project gets a custom proposal.",
} as const;

export const PRICING_TIERS: readonly PricingTier[] = [
  {
    id: "starter",
    name: "Starter Website",
    price: "$2,500",
    priceLabel: "FROM",
    description:
      "A polished, fast site to establish credibility and capture leads.",
    features: [
      "Up to 5 pages",
      "Mobile-first design",
      "Basic SEO setup",
      "Contact + lead capture",
    ],
    isPopular: false,
    ctaLabel: "Learn More",
    ctaHref: "#contact",
  },
  {
    id: "business",
    name: "Business & E-commerce",
    price: "$3,500",
    priceLabel: "FROM",
    description:
      "A conversion-focused site or online store built to grow revenue.",
    features: [
      "Custom design",
      "Shopify or CMS build",
      "Advanced SEO + schema",
      "Integrations & automation",
    ],
    isPopular: true,
    ctaLabel: "Learn More",
    ctaHref: "#contact",
  },
  {
    id: "custom",
    name: "Custom & Plus",
    price: "$7,500",
    priceLabel: "FROM",
    description:
      "Custom web apps and Shopify Plus builds with deep functionality.",
    features: [
      "Custom development",
      "Portals & dashboards",
      "API integrations",
      "Ongoing partnership",
    ],
    isPopular: false,
    ctaLabel: "Learn More",
    ctaHref: "#contact",
  },
] as const;
