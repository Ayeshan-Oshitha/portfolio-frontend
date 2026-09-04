import type { AdminBadgeTone, AdminBadgeVariant } from "./types";

/**
 * Status pill for tables and detail headers.
 *
 * The CMS previously borrowed the client `Badge`, which is built from the
 * marketing theme's bespoke tokens (`fw-icon-bg`, `text-icon-fg`, `bg-raise`,
 * `border-hair`). Those are not declared in the `admin-light` block, so the
 * badge inherited the marketing gradient — and flipped to its dark-theme
 * values whenever the visitor had dark mode selected on `<html>`. Owning the
 * component here keeps it on admin tokens only.
 *
 * `tone` says what the label means; `variant` says how loud it is. Keeping
 * them separate is what lets a table show "Published" and "Draft" as the
 * same shape at different weights.
 */

/* Written out per tone/variant rather than interpolated: Tailwind scans for
   whole class names, so `bg-${tone}-50` would never be generated. */
const TONE_CLASSES: Record<
  AdminBadgeVariant,
  Record<AdminBadgeTone, string>
> = {
  solid: {
    neutral: "bg-surface-700 text-text-primary",
    brand: "bg-primary-600 text-white",
    success: "bg-success-500 text-white",
    warning: "bg-warning-500 text-white",
    danger: "bg-danger-500 text-white",
    info: "bg-accent-500 text-white",
  },
  soft: {
    neutral: "bg-surface-800 text-text-secondary border border-border-subtle",
    brand: "bg-primary-50 text-primary-700 border border-primary-200",
    success: "bg-success-50 text-success-500 border border-success-400/30",
    warning: "bg-warning-50 text-warning-500 border border-warning-400/30",
    danger: "bg-danger-50 text-danger-500 border border-danger-400/30",
    info: "bg-accent-50 text-accent-600 border border-accent-200",
  },
  outline: {
    neutral: "text-text-secondary border border-border-default",
    brand: "text-primary-700 border border-primary-300",
    success: "text-success-500 border border-success-400/50",
    warning: "text-warning-500 border border-warning-400/50",
    danger: "text-danger-500 border border-danger-400/50",
    info: "text-accent-600 border border-accent-300",
  },
};

interface BadgeProps {
  readonly tone?: AdminBadgeTone;
  readonly variant?: AdminBadgeVariant;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export default function Badge({
  tone = "neutral",
  variant = "soft",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight whitespace-nowrap ${TONE_CLASSES[variant][tone]} ${className}`}
    >
      {children}
    </span>
  );
}
