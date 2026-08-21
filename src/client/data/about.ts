import type { AboutData } from "@/client/types";

export const ABOUT_DATA: AboutData = {
  badge: "About Me",
  greeting: "Hey, I'm",
  name: "YourName!",
  role: "Frontend Developer",
  location: "Based in Phoenix, AZ",
  bio: 'Design is where I started (graphic design + animation), so I don\'t just "make websites" — I work in React, Next.js, and Tailwind to ship fast, responsive sites with performance and UX baked in. Everything is intentional: it should look right, feel smooth, and communicate the brand clearly.',
  closingQuote:
    "If you want a site that converts and doesn't crumble the second you need updates, that's my lane.",
  primaryCta: {
    label: "View My Work",
    href: "#projects",
  },
  secondaryCta: {
    label: "Get In Touch",
    href: "#contact",
  },
  imagePlaceholder: "/images/about/profile.webp",
} as const;
