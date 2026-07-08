import { Check, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import type { PricingTier } from "../../types";

interface PricingCardProps {
  readonly tier: PricingTier;
}

export default function PricingCard({ tier }: PricingCardProps) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        tier.isPopular
          ? "bg-surface-800/80 border-2 border-primary-500/40 shadow-lg shadow-primary-600/10 hover:border-primary-400/60 hover:shadow-primary-500/20"
          : "bg-surface-900/60 border border-border-subtle hover:border-primary-600/20 hover:shadow-primary-600/5"
      }`}
    >
      {/* Popular badge */}
      {tier.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-600/30">
            Most Popular
          </span>
        </div>
      )}

      {/* Tier name */}
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {tier.name}
      </h3>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-text-muted">
          {tier.priceLabel}
        </span>
        <span className="text-4xl font-bold text-text-primary tracking-tight">
          {tier.price}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed mb-8">
        {tier.description}
      </p>

      {/* Features list */}
      <ul className="flex flex-col gap-3.5 mb-8 flex-1" role="list">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={16}
              className={`shrink-0 mt-0.5 ${
                tier.isPopular ? "text-primary-400" : "text-text-muted"
              }`}
            />
            <span className="text-sm text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        href={tier.ctaHref}
        variant={tier.isPopular ? "primary" : "outline"}
        size="md"
        icon={<ArrowRight size={16} />}
        className="w-full uppercase tracking-wider text-xs"
      >
        {tier.ctaLabel}
      </Button>
    </article>
  );
}
