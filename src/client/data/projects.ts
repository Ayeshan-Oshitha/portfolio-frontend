import type { Project, SectionHeaderConfig } from "@/client/types";

export const PROJECTS_HEADER: SectionHeaderConfig = {
  badge: "Featured Work",
  title: "Featured\nProjects",
  subtitle:
    "Success stories from clients who trusted my expertise to bring their vision to life.",
} as const;

export const PROJECT_CATEGORIES = [
  "Backend Development",
  "Blockchain Development",
  "Content Management (CMS)",
  "Frontend Development",
  "Integrations & Automation",
  "Mobile Development",
  "Web Design",
] as const;

export const ALL_PROJECTS: readonly Project[] = [
  {
    id: "dropfi",
    title: "DropFi",
    tagline: "Finally, a Modern XRP Wallet That Doesn't Suck",
    description:
      "A zero-permission architecture XRP wallet offering pure, decentralized access to the XRP Ledger on-chain, on your terms.",
    year: 2025,
    index: 1,
    tags: ["Frontend Development", "Backend Development"], // Used on Home
    categories: ["Frontend Development", "Backend Development", "Web Design"], // Used on Work
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "XRP Ledger API",
    ],
    imagePlaceholder: "/images/projects/dropfi.webp",
    href: "#",
  },
  {
    id: "cryptoland",
    title: "CryptoLand",
    tagline: "Blockchain based Strategy Game",
    description:
      "An immersive blockchain strategy game where players build, trade, and conquer using smart contracts and NFTs.",
    year: 2024,
    index: 2,
    tags: ["Blockchain Development", "Web Design"],
    categories: [
      "Frontend Development",
      "Web Design",
      "Blockchain Development",
    ],
    technologies: ["React", "Solidity", "Ethers.js", "Figma", "Node.js"],
    imagePlaceholder: "/images/projects/cryptoland.webp",
    href: "#",
  },
  {
    id: "sf-ventures",
    title: "S.F. Ventures",
    tagline: "Take your business to new heights",
    description:
      "Modern business solutions portal designed to help companies track growth metrics and manage clients.",
    year: 2023,
    index: 3,
    tags: ["Web Design", "Content Management (CMS)"],
    categories: [
      "Web Design",
      "Content Management (CMS)",
      "Integrations & Automation",
    ],
    technologies: ["Vue.js", "Tailwind CSS", "Strapi", "PostgreSQL"],
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
    index: 4,
    tags: ["Web Design", "E-commerce"],
    categories: ["Web Design", "Frontend Development"],
    technologies: ["React", "Framer Motion", "Stripe API", "Firebase"],
    imagePlaceholder: "/images/projects/flavour-fusion.webp",
    href: "#",
  },
  {
    id: "apex-fitness",
    title: "Apex Fitness",
    tagline: "Transform your body, transform your life",
    description:
      "A modern fitness app with membership management, class scheduling, and health progress tracking.",
    year: 2021,
    index: 5,
    tags: ["Frontend Development", "Mobile Development"],
    categories: ["Mobile Development", "Backend Development"],
    technologies: ["React Native", "Node.js", "GraphQL", "AWS"],
    imagePlaceholder: "/images/projects/apex-fitness.webp",
    href: "#",
  },
] as const;

// The Home page only displays the first 4 projects as featured
export const FEATURED_PROJECTS: readonly Project[] = ALL_PROJECTS.slice(0, 4);
