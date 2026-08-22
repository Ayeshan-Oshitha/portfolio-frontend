import {
  ShoppingCart,
  Monitor,
  Palette,
  Smartphone,
  Code2,
  Search,
} from "lucide-react";
import type { Service, SectionHeaderConfig } from "@/client/types";

export const SERVICES_HEADER: SectionHeaderConfig = {
  badge: "What I Do",
  title: "Services Built\nTo Grow Your Business",
  subtitle:
    "Web design, e-commerce, and SEO for Mesa & Phoenix businesses — built to rank on Google and turn visitors into customers.",
} as const;

export const SERVICES: readonly Service[] = [
  {
    id: "ecommerce",
    title: "E-commerce",
    description:
      "Custom Shopify and Shopify Plus stores built to sell — fast storefronts, clean checkouts, migrations, and integrations engineered to turn browsers into buyers.",
    icon: ShoppingCart,
    href: "/contact",
  },
  {
    id: "web-design",
    title: "Web Design",
    description:
      "Modern, mobile-first websites that look premium and convert. Every layout and call-to-action is built to guide visitors toward calls, quotes, and sales.",
    icon: Monitor,
    href: "/contact",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description:
      "Brand identity, logos, book covers, and marketing collateral that look premium and stay consistent across every touchpoint.",
    icon: Palette,
    href: "/contact",
  },
  {
    id: "app-development",
    title: "App Development",
    description:
      "Cross-platform mobile apps and web applications in React Native and Expo — built for iOS, Android, and the browser.",
    icon: Smartphone,
    href: "/contact",
  },
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Custom websites and web apps in React and Next.js when a template won't cut it — portals, dashboards, integrations, and automation that just work.",
    icon: Code2,
    href: "/contact",
  },
  {
    id: "seo",
    title: "SEO & Local SEO",
    description:
      "Get found by customers ready to buy. Technical SEO, local SEO, and Google Business Profile optimization to win the Phoenix-area map pack and search results.",
    icon: Search,
    href: "/contact",
  },
] as const;
