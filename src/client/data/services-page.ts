import {
  BarChart3,
  CreditCard,
  Gauge,
  Layers,
  Link2,
  Lock,
  PenTool,
  Search,
  ServerCog,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import type {
  FAQ,
  Metric,
  ProcessStep,
  SectionHeaderConfig,
  ServiceDetail,
} from "@/client/types";

export const SERVICES_PAGE_HEADER: SectionHeaderConfig = {
  badge: "Services",
  title: "Everything it takes\nto ship, and keep shipping.",
  subtitle:
    "Six disciplines, one team. We scope, design, build, launch and maintain — so there is never a handoff where the quality drops.",
} as const;

export const SERVICES_PAGE_STATS: readonly Metric[] = [
  {
    id: "proposal",
    value: "3 days",
    label: "From enquiry to written proposal",
  },
  { id: "release", value: "6 weeks", label: "Median time to first release" },
] as const;

export const PROCESS_HEADER: SectionHeaderConfig = {
  badge: "How we work",
  title: "Four steps. No surprises.",
} as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "scope",
    step: "01",
    title: "Scope",
    description:
      "A working session to pin down the problem, the users and the must-haves. You leave with a written scope and a fixed price.",
  },
  {
    id: "design",
    step: "02",
    title: "Design",
    description:
      "Flows and screens you can click through before we build them — plus the token system the whole product inherits.",
  },
  {
    id: "build",
    step: "03",
    title: "Build",
    description:
      "Two-week increments on a staging URL you can watch. Typed, tested, reviewed — no black box, no surprise invoice.",
  },
  {
    id: "launch",
    step: "04",
    title: "Launch & keep",
    description:
      "We ship it, monitor it, and hand over documentation. Stay on a support plan or take the keys — entirely your call.",
  },
] as const;

export const FAQ_DATA: readonly FAQ[] = [
  {
    id: "ownership",
    question: "Who owns the code?",
    answer:
      "You do, from the first commit. The repository lives in your organisation and we work in it — there is no handover event, because there is nothing to hand over.",
  },
  {
    id: "scope-change",
    question: "What if the scope changes mid-build?",
    answer:
      "Small changes inside the agreed scope are absorbed. Anything larger gets its own small fixed-price addendum that you approve before we start it — never an open-ended hourly bill.",
  },
  {
    id: "existing-team",
    question: "Can you work with our existing team?",
    answer:
      "Yes. We work in your repository, your ticket tracker and your review process. On roughly half our projects we are extending a team rather than replacing one.",
  },
  {
    id: "after-launch",
    question: "What happens after launch?",
    answer:
      "You get documentation, a runbook and the keys to every account. From there you can take it in-house, keep us on a support plan, or call us only when something needs building.",
  },
] as const;

/**
 * Detail content per service. The cost section reuses ids from
 * PRICING_TIERS so there is only ever one real price list on the site.
 */
export const SERVICE_DETAILS: readonly ServiceDetail[] = [
  {
    slug: "saas-web-apps",
    title: "SaaS & web applications",
    deck: "Multi-tenant products with the unglamorous parts already solved — authentication, billing, roles, audit trails and an admin surface your support team can actually use.",
    stats: [
      { id: "timeline", value: "6–14wk", label: "typical timeline" },
      { id: "cadence", value: "2wk", label: "release cadence" },
    ],
    included: [
      {
        id: "auth",
        title: "Authentication & roles",
        description:
          "Email, social and SSO sign-in, organisation membership, and a role model that survives your first enterprise customer.",
        icon: Lock,
      },
      {
        id: "billing",
        title: "Billing & subscriptions",
        description:
          "Stripe plans, trials, proration, dunning and invoices — plus the webhook plumbing that keeps state honest.",
        icon: CreditCard,
      },
      {
        id: "admin",
        title: "Admin & reporting",
        description:
          "An internal surface your support team can use without a developer, and the reports your board will ask for.",
        icon: BarChart3,
      },
      {
        id: "observability",
        title: "Observability & audit",
        description:
          "Structured logs, error tracking, uptime alerting and an append-only audit trail — set up before launch, not after an incident.",
        icon: ShieldCheck,
      },
    ],
    stack: [
      "TypeScript",
      "React",
      "Next.js",
      ".NET",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS",
      "Stripe",
    ],
    relevantTiers: ["business", "custom"],
  },
  {
    slug: "web-ecommerce",
    title: "Web & e-commerce",
    deck: "Marketing sites and Shopify or Shopify Plus storefronts shaped around the checkout — fast, accessible, and measured on revenue rather than page views.",
    stats: [
      { id: "timeline", value: "3–8wk", label: "typical timeline" },
      { id: "lighthouse", value: "95+", label: "Lighthouse target" },
    ],
    included: [
      {
        id: "storefront",
        title: "Storefront build",
        description:
          "A custom theme or headless storefront, built from your catalogue structure rather than a template you have to fight.",
        icon: ShoppingBag,
      },
      {
        id: "checkout",
        title: "Checkout & payments",
        description:
          "Payment methods, tax and shipping rules configured and tested against real orders before you go live.",
        icon: CreditCard,
      },
      {
        id: "migration",
        title: "Migration",
        description:
          "Products, customers, orders and URLs moved across with redirects in place, so the search rankings come with you.",
        icon: ServerCog,
      },
      {
        id: "speed",
        title: "Speed & Core Web Vitals",
        description:
          "Image pipeline, font loading and script budget tuned — the work that quietly decides your conversion rate.",
        icon: Gauge,
      },
    ],
    stack: [
      "Shopify",
      "Liquid",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Stripe",
    ],
    relevantTiers: ["starter", "business"],
  },
  {
    slug: "mobile-apps",
    title: "Mobile apps",
    deck: "Cross-platform apps in React Native and Expo — one codebase for iOS, Android and the browser, shipped to both stores and kept there.",
    stats: [
      { id: "timeline", value: "8–16wk", label: "typical timeline" },
      { id: "platforms", value: "3", label: "platforms, one codebase" },
    ],
    included: [
      {
        id: "app",
        title: "The app itself",
        description:
          "Native navigation, offline handling and platform conventions respected on both stores — not a website in a wrapper.",
        icon: Smartphone,
      },
      {
        id: "sync",
        title: "Offline & sync",
        description:
          "Local-first data with a conflict-resolution model chosen for your workflow, so the app works on a bad connection.",
        icon: ServerCog,
      },
      {
        id: "release",
        title: "Store release pipeline",
        description:
          "Signing, review submission, staged rollout and over-the-air updates configured so shipping is routine.",
        icon: Layers,
      },
      {
        id: "telemetry",
        title: "Crash & usage telemetry",
        description:
          "Crash reporting and funnel analytics wired in from the first build, so the roadmap is evidence-led.",
        icon: BarChart3,
      },
    ],
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Firebase",
    ],
    relevantTiers: ["business", "custom"],
  },
  {
    slug: "design-systems",
    title: "Brand & design systems",
    deck: "Identity, product UI and a documented token system your team can extend long after we are done — the opposite of a static brand PDF.",
    stats: [
      { id: "timeline", value: "3–6wk", label: "typical timeline" },
      { id: "themes", value: "2", label: "themes, one token set" },
    ],
    included: [
      {
        id: "identity",
        title: "Identity",
        description:
          "Wordmark, palette, type scale and the usage rules that keep it consistent when someone else applies it.",
        icon: PenTool,
      },
      {
        id: "tokens",
        title: "Token system",
        description:
          "One source of truth for colour, spacing and elevation — so a rebrand or a new theme is one file, not a fortnight.",
        icon: Layers,
      },
      {
        id: "components",
        title: "Component library",
        description:
          "The primitives your product actually repeats, built in code with their states and accessibility already handled.",
        icon: Layers,
      },
      {
        id: "docs",
        title: "Documentation",
        description:
          "Written guidance on when to use what, so the system survives contact with people who were not in the room.",
        icon: BarChart3,
      },
    ],
    stack: ["Figma", "React", "TypeScript", "Tailwind CSS", "Storybook"],
    relevantTiers: ["starter", "business"],
  },
  {
    slug: "integrations",
    title: "Integrations & API",
    deck: "Portals, dashboards and third-party integrations — Stripe, HubSpot, ERPs and the legacy system nobody on your team wants to open.",
    stats: [
      { id: "timeline", value: "2–10wk", label: "typical timeline" },
      { id: "uptime", value: "99.9%", label: "integration uptime target" },
    ],
    included: [
      {
        id: "api",
        title: "API design",
        description:
          "A versioned, documented interface built to be consumed by someone who has never spoken to you.",
        icon: Link2,
      },
      {
        id: "sync",
        title: "Data sync",
        description:
          "Idempotent jobs, retries and dead-letter handling — so a third party going down for an hour is not your incident.",
        icon: ServerCog,
      },
      {
        id: "portals",
        title: "Portals & dashboards",
        description:
          "The internal screens that replace the spreadsheet, with the permissions your operations team actually needs.",
        icon: BarChart3,
      },
      {
        id: "monitoring",
        title: "Monitoring",
        description:
          "Alerting on the integration itself, not just the server — you hear about a broken sync before your customer does.",
        icon: ShieldCheck,
      },
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "NestJS",
      ".NET",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    relevantTiers: ["business", "custom"],
  },
  {
    slug: "seo-growth",
    title: "SEO & growth",
    deck: "Technical SEO, schema and Core Web Vitals work, so the thing we ship keeps earning traffic month after month instead of peaking at launch.",
    stats: [
      { id: "timeline", value: "2–4wk", label: "audit and first fixes" },
      { id: "plan", value: "90 days", label: "roadmap you keep" },
    ],
    included: [
      {
        id: "audit",
        title: "Technical audit",
        description:
          "Crawl, index coverage, duplication and internal linking — the findings ranked by what actually moves traffic.",
        icon: Search,
      },
      {
        id: "schema",
        title: "Schema & metadata",
        description:
          "Structured data, canonical rules and social metadata implemented in code rather than bolted on by a plugin.",
        icon: Layers,
      },
      {
        id: "vitals",
        title: "Core Web Vitals",
        description:
          "Real-user metrics measured, then the render path fixed — usually images, fonts and third-party scripts.",
        icon: Gauge,
      },
      {
        id: "reporting",
        title: "Reporting",
        description:
          "A dashboard tied to revenue and enquiries, not vanity rankings, plus a written 90-day plan you own.",
        icon: BarChart3,
      },
    ],
    stack: ["Google Search Console", "GA4", "Lighthouse", "Schema.org"],
    relevantTiers: ["starter", "business"],
  },
] as const;

export function findServiceDetail(
  slug: string | undefined,
): ServiceDetail | undefined {
  return SERVICE_DETAILS.find((service) => service.slug === slug);
}
