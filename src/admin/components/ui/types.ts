/**
 * Variant vocabularies for the admin design system.
 *
 * These deliberately do not reuse `ButtonVariant`/`ButtonSize` from
 * `@/client/types`: those are shared with the client `Button`, so widening
 * them for the CMS (a `danger` fill, an `xs` icon size) would force the
 * marketing button to grow variants it has no design for. The two systems
 * now diverge on purpose — the CMS is a dense tool, the client site is a
 * marketing surface.
 */

export type AdminButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "subtle" | "danger";

export type AdminButtonSize = "xs" | "sm" | "md" | "lg";

/** Semantic colour of a badge — what the label *means*, not how it looks. */
export type AdminBadgeTone =
  "neutral" | "brand" | "success" | "warning" | "danger" | "info";

/** Visual weight of a badge, independent of its tone. */
export type AdminBadgeVariant = "solid" | "soft" | "outline";

/** Control height, shared by buttons and form fields so they line up. */
export type AdminFieldSize = "sm" | "md";
