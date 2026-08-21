import type { FooterData } from "@/client/types";

export const FOOTER_DATA: FooterData = {
  addressLines: ["YourName Studios", "Mesa, AZ 85212"],
  email: "hello@yourdomain.com",
  serviceArea:
    "Serving Mesa, Phoenix, Tempe, Scottsdale, Chandler, Gilbert, Queen Creek, AZ",
  copyright:
    "© 2026 YourName Studios. Web design & e-commerce development in Mesa, AZ.",
  linkGroups: [
    {
      title: "COMPANY",
      links: [
        { label: "Services", href: "/services" },
        { label: "Work", href: "/work" },
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Free Audit", href: "#" },
      ],
    },
    {
      title: "SERVICES",
      links: [
        { label: "E-commerce", href: "#" },
        { label: "Web Design", href: "#" },
        { label: "Graphic Design", href: "#" },
        { label: "App Development", href: "#" },
        { label: "Web Development", href: "#" },
        { label: "SEO", href: "#" },
        { label: "All services →", href: "/services", isAccent: true },
      ],
    },
  ],
} as const;
