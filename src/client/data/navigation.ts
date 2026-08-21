import { Code2, Briefcase, Camera, Pen } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { NavItem, SocialLink, BrandInfo } from "@/client/types";

export const BRAND: BrandInfo = {
  name: "YourName",
  tagline: "Web Development",
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
