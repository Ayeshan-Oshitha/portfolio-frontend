import { Code2, Briefcase, Camera, Pen } from "lucide-react";
import type { NavItem, SocialLink, BrandInfo } from "../types";

export const BRAND: BrandInfo = {
  name: "YourName",
  tagline: "Web Design & Development",
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Technologies", href: "#technologies" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    platform: "GitHub",
    href: "https://github.com",
    icon: Code2,
    ariaLabel: "Visit GitHub profile",
  },
  {
    platform: "LinkedIn",
    href: "https://linkedin.com",
    icon: Briefcase,
    ariaLabel: "Visit LinkedIn profile",
  },
  {
    platform: "Instagram",
    href: "https://instagram.com",
    icon: Camera,
    ariaLabel: "Visit Instagram profile",
  },
  {
    platform: "Dribbble",
    href: "https://dribbble.com",
    icon: Pen,
    ariaLabel: "Visit Dribbble profile",
  },
] as const;
