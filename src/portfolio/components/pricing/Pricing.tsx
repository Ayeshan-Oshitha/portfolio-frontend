import { ArrowRight } from "lucide-react";
import { PRICING_HEADER, PRICING_TIERS } from "../../data/pricing";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import PricingCard from "./PricingCard";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 sm:py-32"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader {...PRICING_HEADER} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center mt-14">
          <Button
            href="#contact"
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
            className="uppercase tracking-wider text-xs"
          >
            Get a Free Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
