import type { FooterData } from "@/client/types";

export const FOOTER_DATA: FooterData = {
  blurb: "SaaS products and custom platforms, engineered with clarity.",
  email: "[hello@frostwoodtech.com]",
  copyright: "© 2026 FrostWoodTech. All rights reserved.",
  linkGroups: [
    {
      title: "PRODUCTS",
      links: [
        { label: "Frostboard", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Pricing", href: "/pricing" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "SERVICES",
      links: [
        { label: "SaaS & web apps", href: "/services" },
        { label: "Web & e-commerce", href: "/services" },
        { label: "Design systems", href: "/services" },
        { label: "SEO & growth", href: "/services" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About", href: "/about" },
        { label: "Work", href: "/work" },
        { label: "Blog", href: "/blog" },
        { label: "Reviews", href: "/reviews" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
} as const;
