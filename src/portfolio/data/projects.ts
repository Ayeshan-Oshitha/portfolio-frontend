import type { Project, SectionHeaderConfig } from "../types";

export const PROJECTS_HEADER: SectionHeaderConfig = {
  badge: "Portfolio",
  title: "Featured\nProjects",
  subtitle:
    "Success stories from clients who trusted my expertise to bring their vision to life.",
} as const;

export const FEATURED_PROJECTS: readonly Project[] = [
  {
    id: "sf-ventures",
    title: "S.F. Ventures",
    tagline: "Take your business to new heights",
    description:
      "S.F. Ventures delivers modern business solutions designed to help companies grow with confidence.",
    year: 2021,
    index: 1,
    tags: ["Web Design", "Content Management (CMS)"],
    imagePlaceholder: "/images/projects/sf-ventures.webp",
    href: "#",
  },
  {
    id: "flavour-fusion",
    title: "Flavour Fusion",
    tagline: "A culinary experience like no other",
    description:
      "A premium restaurant website with online reservations, menu management, and a seamless ordering experience.",
    year: 2022,
    index: 2,
    tags: ["Web Design", "E-commerce", "UI/UX Design"],
    imagePlaceholder: "/images/projects/flavour-fusion.webp",
    href: "#",
  },
  {
    id: "apex-fitness",
    title: "Apex Fitness",
    tagline: "Transform your body, transform your life",
    description:
      "A modern fitness platform with membership management, class scheduling, and progress tracking for gym members.",
    year: 2023,
    index: 3,
    tags: ["Frontend Development", "Backend Development", "Web Design"],
    imagePlaceholder: "/images/projects/apex-fitness.webp",
    href: "#",
  },
  {
    id: "nxn-crypto",
    title: "NXN",
    tagline: "Decentralized currency done safely",
    description:
      "A decentralized finance brand focused on secure, user-friendly digital currency experiences.",
    year: 2024,
    index: 4,
    tags: ["Frontend Development", "Backend Development", "Web Design"],
    imagePlaceholder: "/images/projects/nxn-crypto.webp",
    href: "#",
  },
] as const;
