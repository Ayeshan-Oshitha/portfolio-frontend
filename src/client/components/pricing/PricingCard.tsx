import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { PricingTier } from "@/client/types";

interface PricingCardProps {
  readonly tier: PricingTier;
}

export default function PricingCard({ tier }: PricingCardProps) {
  const { isPopular } = tier;

  return (
    <div
      className={`relative flex flex-col gap-5 overflow-hidden rounded-[20px] border p-8 ${
        isPopular
          ? "fw-panel fw-grain border-panel-br shadow-panel lg:z-10 lg:scale-105"
          : "border-card-br bg-card shadow-card"
      }`}
    >
      <div className="relative z-2">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-xs font-bold tracking-[0.1em] uppercase ${
              isPopular ? "text-panel-ink-2" : "text-text-muted"
            }`}
          >
            {tier.name}
          </span>
          {isPopular && (
            <span className="shrink-0 rounded-full bg-amber px-3 py-1 text-[11px] font-extrabold tracking-[0.05em] text-amber-ink">
              MOST POPULAR
            </span>
          )}
        </div>

        <div className="mt-3.5 flex items-baseline gap-2">
          <span
            className={`font-display text-[44px] leading-none font-medium tabular-nums ${
              isPopular ? "text-panel-ink" : "text-text-primary"
            }`}
          >
            {tier.price}
          </span>
          <span
            className={`text-[13.5px] ${
              isPopular ? "text-panel-ink-2" : "text-text-muted"
            }`}
          >
            {tier.priceLabel}
          </span>
        </div>

        <p
          className={`mt-3.5 text-[14.5px] leading-[1.6] ${
            isPopular ? "text-panel-ink-2" : "text-text-secondary"
          }`}
        >
          {tier.description}
        </p>
      </div>

      <div
        aria-hidden="true"
        className={`relative z-2 h-px ${
          isPopular ? "bg-panel-chip-br" : "bg-hair"
        }`}
      />

      <ul className="relative z-2 flex flex-col gap-3">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className={`flex items-center gap-2.5 text-[14.5px] ${
              isPopular ? "text-panel-ink" : "text-text-primary"
            }`}
          >
            <Check
              size={16}
              aria-hidden="true"
              className={`shrink-0 ${
                isPopular ? "text-panel-ink" : "text-primary-400"
              }`}
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to={tier.ctaHref}
        className={`relative z-2 mt-auto rounded-xl py-3.5 text-center text-[14.5px] font-bold transition-all duration-200 ${
          isPopular
            ? "bg-panel-btn text-panel-btn-ink hover:-translate-y-0.5"
            : "border border-card-br bg-surface-900 text-text-primary hover:border-hair-strong"
        }`}
      >
        {tier.ctaLabel}
      </Link>
    </div>
  );
}
