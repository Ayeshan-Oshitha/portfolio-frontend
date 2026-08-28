import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PanelCTAProps {
  readonly title: React.ReactNode;
  readonly description: string;
  readonly primaryLabel: string;
  readonly primaryHref: string;
  readonly secondaryLabel?: string;
  readonly secondaryHref?: string;
  /** `split` puts the action on the right; `center` stacks it underneath. */
  readonly align?: "split" | "center";
  readonly className?: string;
}

/**
 * The contrast closing band — a deep-forest surface on dark, a light
 * ice/forest tint on light. Its buttons use the `panel-*` tokens (which
 * flip with the theme) rather than the theme-flipping Button variants,
 * since the panel's own contrast needs stay self-consistent either way.
 */
export default function PanelCTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  align = "split",
  className = "",
}: PanelCTAProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`relative overflow-hidden fw-panel fw-grain rounded-[26px] border border-panel-br shadow-panel px-8 py-14 sm:px-15 ${
        isCenter
          ? "text-center"
          : "flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between"
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-50 left-1/4 h-125 w-200 fw-amb-1"
      />

      <div className={`relative z-2 ${isCenter ? "" : "max-w-xl"}`}>
        <h2 className="font-display text-[32px] sm:text-[38px] font-medium leading-[1.12] tracking-[-0.018em] text-panel-ink">
          {title}
        </h2>
        <p
          className={`mt-3.5 text-base leading-relaxed text-panel-ink-2 ${
            isCenter ? "mx-auto max-w-lg" : "max-w-md"
          }`}
        >
          {description}
        </p>
      </div>

      <div
        className={`relative z-2 flex flex-wrap gap-3.5 ${
          isCenter ? "mt-9 justify-center" : "shrink-0"
        }`}
      >
        <Link
          to={primaryHref}
          className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-xl bg-panel-btn px-7 py-4 text-[15.5px] font-extrabold text-panel-btn-ink transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-panel-btn focus-visible:ring-offset-2 focus-visible:ring-offset-panel-br"
        >
          {primaryLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>

        {secondaryLabel && secondaryHref && (
          <Link
            to={secondaryHref}
            className="inline-flex items-center whitespace-nowrap rounded-xl border border-panel-chip-br bg-panel-chip px-7 py-4 text-[15.5px] font-bold text-panel-ink transition-colors duration-200 hover:bg-panel-chip-br focus:outline-none focus-visible:ring-2 focus-visible:ring-panel-btn"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
