import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

// ─── Navigation ──────────────────────────────────────────────
export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface SocialLink {
  readonly platform: string;
  readonly href: string;
  readonly icon: LucideIcon | IconType;
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
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly year: number; // Used for internal sorting, not displayed on Work card
  readonly index: number;
  readonly tags: readonly string[]; // Used for Home page featured cards
  readonly categories: readonly string[];
  readonly technologies: readonly string[];
  readonly imagePlaceholder: string;
  readonly href: string;
  // Case-study fields — only populated when the project came from the API
  // and only needed by the detail page, so they stay optional here.
  readonly websiteUrl?: string;
  readonly clientName?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly images?: readonly ProjectImage[];
}

export interface ProjectImage {
  readonly id: string;
  readonly url: string;
  readonly altText: string;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

export interface BlogPost {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly date: string;
  readonly readTime: string;
  readonly imagePlaceholder: string;
  readonly href: string;
  // Detail-page-only field, populated when the post came from the API.
  readonly contentMarkdown?: string;
  readonly mediumUrl?: string;
}

// ─── Reviews ─────────────────────────────────────────────────
export interface Review {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
  readonly createdAt: string;
}

export type ReviewSort = "latest" | "rating" | "country";

export interface SubmitReviewPayload {
  readonly name: string;
  readonly country: string;
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
}

// ─── API DTOs (public surface) ──────────────────────────────
export type Site = "agency" | "personal";

export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

export interface ApiTag {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly isTechnology: boolean;
  readonly technologyCategory?: string;
  readonly iconUrl?: string;
  readonly colorHex?: string;
  readonly sortOrder: number;
}

export interface ApiProjectImage {
  readonly id: string;
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

export interface ApiProject {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly year: number;
  readonly shortDescription: string;
  readonly description: string;
  readonly websiteUrl?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly clientName?: string;
  readonly publishedAt?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly tags: readonly ApiTag[];
  readonly images: readonly ApiProjectImage[];
}

export interface ApiArticle {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly slug?: string;
  readonly publishedDate: string;
  readonly mediumUrl?: string;
  readonly coverImageKey?: string;
  readonly contentMarkdown?: string;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly tags: readonly ApiTag[];
}

export interface ApiReview {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
  readonly createdAt: string;
}

export type ApiErrorCode =
  | "validation_failed"
  | "site_required"
  | "not_found"
  | "forbidden"
  | string;

export interface ApiProblem {
  readonly status?: number;
  readonly title?: string;
  readonly detail?: string;
  readonly code?: ApiErrorCode;
}

export interface ServiceOffering {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly features: readonly string[];
}

export interface FAQ {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

// ─── Technologies ────────────────────────────────────────────
export interface Technology {
  readonly name: string;
  readonly icon: string;
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

export interface Experience {
  readonly id: string;
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly description: string;
}

export interface StoryData {
  readonly badge: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface Highlight {
  readonly id: string;
  readonly metric: string;
  readonly label: string;
}

export interface CoreValue {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
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

// ─── Footer ──────────────────────────────────────────────────
export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly isAccent?: boolean;
}

export interface FooterLinkGroup {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

export interface FooterData {
  readonly addressLines: readonly string[];
  readonly email: string;
  readonly serviceArea: string;
  readonly linkGroups: readonly FooterLinkGroup[];
  readonly copyright: string;
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
