import SectionHeader from "@/client/components/ui/SectionHeader";
import PricingCard from "./PricingCard";
import { PRICING_HEADER, PRICING_TIERS } from "@/client/data/pricing";

export default function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-26 sm:px-6 lg:px-8">
      <SectionHeader {...PRICING_HEADER} tone="ice" />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
        {PRICING_TIERS.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>
    </section>
  );
}
