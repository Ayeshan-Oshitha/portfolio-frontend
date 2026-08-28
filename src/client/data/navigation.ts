import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { NavItem, SocialLink, BrandInfo } from "@/client/types";

export const BRAND: BrandInfo = {
  name: "FrostWoodTech",
  tagline: "SaaS & Custom Platforms",
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Case Studies", href: "/work" },
  { label: "Plans & Pricing", href: "/pricing" },
  { label: "Insights", href: "/blog" },
  { label: "About Us", href: "/about" },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    platform: "GitHub",
    href: "https://github.com/Ayeshan-Oshitha",
    icon: FaGithub,
    ariaLabel: "Visit GitHub profile",
  },
  {
    platform: "LinkedIn",
    href: "https://www.linkedin.com/in/oshitha-costa",
    icon: FaLinkedin,
    ariaLabel: "Visit LinkedIn profile",
  },
] as const;
