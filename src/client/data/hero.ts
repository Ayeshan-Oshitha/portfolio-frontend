import type { HeroData } from "@/client/types";

export const HERO_DATA: HeroData = {
  badge: "Web Design & E-Commerce Development",
  headlinePrimary: "Websites &\n",
  headlineHighlight: "Stores That Sell",
  headlineSuffix: ".",
  description:
    "I help businesses generate more leads, bookings, and online sales with fast, high-converting websites and Shopify stores. Based in Mesa, serving the entire Phoenix metro.",
  primaryCta: {
    label: "Get a Free Quote",
    href: "#contact",
  },
  secondaryCta: {
    label: "View My Work",
    href: "#projects",
  },
} as const;
