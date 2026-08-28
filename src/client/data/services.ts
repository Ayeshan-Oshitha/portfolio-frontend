import {
  LayoutDashboard,
  Link2,
  Search,
  Smartphone,
  Sparkles,
  ShoppingCart,
  TerminalSquare,
} from "lucide-react";
import type {
  BentoCell,
  Service,
  SectionHeaderConfig,
} from "@/client/types";

export const SERVICES_HEADER: SectionHeaderConfig = {
  badge: "What we build",
  title: "Two ways to grow —\none standard of craft.",
  subtitle:
    "Subscribe to a product we already run, or commission a platform engineered around your exact workflow.",
} as const;

/** Home page — the bento grid. The first cell spans two columns. */
export const BENTO_CELLS: readonly BentoCell[] = [
  {
    id: "saas",
    tag: "SAAS",
    title: "Products that are already running.",
    description:
      "Subscription apps we build, host and improve continuously. Onboard your team this week — no build phase, no discovery cycle.",
    icon: LayoutDashboard,
    chips: ["Multi-tenant", "SSO & RBAC", "99.9% SLA", "Data export"],
    feature: true,
  },
  {
    id: "platforms",
    title: "Platforms built to your shape.",
    description:
      "Bespoke web and mobile applications, client portals and internal dashboards — architected for your operations, owned entirely by you.",
    icon: TerminalSquare,
    linkLabel: "See how we work",
    href: "/services",
  },
  {
    id: "design-systems",
    title: "Design systems",
    description:
      "Identity, product UI and a token system your team can extend without us.",
    icon: Sparkles,
  },
  {
    id: "integrations",
    title: "Integrations & API",
    description:
      "Stripe, HubSpot, ERPs and legacy systems, wired together and automated.",
    icon: Link2,
  },
  {
    id: "seo",
    title: "SEO & growth",
    description:
      "Technical and local SEO so the thing we ship keeps compounding for you.",
    icon: Search,
  },
] as const;

/** Services page — the full six-discipline grid. */
export const SERVICES: readonly Service[] = [
  {
    id: "saas-web-apps",
    title: "SaaS & web apps",
    description:
      "Multi-tenant products in React and .NET — auth, billing, roles and admin, production-ready from the first release.",
    icon: LayoutDashboard,
    href: "/services/saas-web-apps",
  },
  {
    id: "web-ecommerce",
    title: "Web & e-commerce",
    description:
      "Marketing sites and Shopify / Shopify Plus storefronts — fast, accessible, and shaped around the checkout.",
    icon: ShoppingCart,
    href: "/services/web-ecommerce",
  },
  {
    id: "mobile-apps",
    title: "Mobile apps",
    description:
      "Cross-platform apps in React Native and Expo — one codebase for iOS, Android and web, shipped to both stores.",
    icon: Smartphone,
    href: "/services/mobile-apps",
  },
  {
    id: "design-systems",
    title: "Brand & design systems",
    description:
      "Identity, product UI and a documented token system your team can extend long after we are done.",
    icon: Sparkles,
    href: "/services/design-systems",
  },
  {
    id: "integrations",
    title: "Integrations & API",
    description:
      "Portals, dashboards and third-party integrations — Stripe, HubSpot, ERPs and the legacy system nobody wants to touch.",
    icon: Link2,
    href: "/services/integrations",
  },
  {
    id: "seo-growth",
    title: "SEO & growth",
    description:
      "Technical SEO, schema and Core Web Vitals work so what we build keeps earning traffic month after month.",
    icon: Search,
    href: "/services/seo-growth",
  },
] as const;
