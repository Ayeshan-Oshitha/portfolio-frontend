import type { LucideIcon } from "lucide-react";

// ─── Navigation ──────────────────────────────────────────────
export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface SocialLink {
  readonly platform: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly ariaLabel: string;
}

export interface BrandInfo {
  readonly name: string;
  readonly tagline: string;
}

// ─── Hero ────────────────────────────────────────────────────
export interface HeroData {
  readonly badge: string;
  readonly headlinePrimary: string;
  readonly headlineHighlight: string;
  readonly headlineSuffix: string;
  readonly description: string;
  readonly primaryCta: CtaConfig;
  readonly secondaryCta: CtaConfig;
}

export interface CtaConfig {
  readonly label: string;
  readonly href: string;
}

// ─── Services ────────────────────────────────────────────────
export interface Service {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly href: string;
}

// ─── Projects ────────────────────────────────────────────────
export interface Project {
  readonly id: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly year: number;
  readonly index: number;
  readonly tags: readonly string[];
  readonly imagePlaceholder: string;
  readonly href: string;
}

// ─── Technologies ────────────────────────────────────────────
export interface Technology {
  readonly name: string;
  readonly icon: LucideIcon;
}

export interface TechnologyCategoryData {
  readonly category: string;
  readonly items: readonly Technology[];
}

// ─── Pricing ─────────────────────────────────────────────────
export interface PricingTier {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly priceLabel: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly isPopular: boolean;
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

// ─── About ───────────────────────────────────────────────────
export interface AboutData {
  readonly badge: string;
  readonly greeting: string;
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly bio: string;
  readonly closingQuote: string;
  readonly primaryCta: CtaConfig;
  readonly secondaryCta: CtaConfig;
  readonly imagePlaceholder: string;
}

// ─── Contact ─────────────────────────────────────────────────
export interface ContactData {
  readonly badge: string;
  readonly headlinePrimary: string;
  readonly headlineHighlight: string;
  readonly headlineSuffix: string;
  readonly description: string;
  readonly email: string;
  readonly serviceTypes: readonly string[];
  readonly formFields: readonly FormFieldConfig[];
}

export interface FormFieldConfig {
  readonly id: string;
  readonly label: string;
  readonly type: "text" | "email" | "tel" | "textarea";
  readonly placeholder: string;
  readonly required: boolean;
  readonly halfWidth?: boolean;
}

// ─── Shared UI ───────────────────────────────────────────────
export interface SectionHeaderConfig {
  readonly badge?: string;
  readonly title: string;
  readonly subtitle?: string;
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant = "default" | "outline" | "subtle";
