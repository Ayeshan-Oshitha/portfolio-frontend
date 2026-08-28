import { Check } from "lucide-react";
import Eyebrow from "@/client/components/ui/Eyebrow";
import PanelCTA from "@/client/components/ui/PanelCTA";
import PricingCard from "@/client/components/pricing/PricingCard";
import {
  ADD_ONS,
  COMPARISON_ROWS,
  PRICING_FAQS,
  PRICING_TIERS,
} from "@/client/data/pricing";

function ComparisonValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="flex justify-center text-primary-400">
        <Check size={17} aria-hidden="true" />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        className="block text-center text-text-muted"
        aria-label="Not included"
      >
        —
      </span>
    );
  }
  return (
    <span className="block text-center text-sm tabular-nums text-text-secondary">
      {value}
    </span>
  );
}

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-200 w-312 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-105 -left-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 pt-23 pb-26 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow align="center" tone="ice" className="mb-5">
            Transparent pricing
          </Eyebrow>
          <h1 className="font-display text-[42px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[56px] lg:text-[66px]">
            Investment that
            <br />
            pays off.
          </h1>
          <p className="mt-5.5 text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
            Every engagement starts with a free scoping call and ends with a
            written, fixed-price proposal. These are the floors, not the
            invoices.
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-9">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>

        {/* Comparison */}
        <div className="mt-24">
          <h2 className="mb-7.5 font-display text-[30px] font-medium tracking-[-0.018em] text-text-primary md:text-[40px]">
            Compare in detail
          </h2>

          <div className="overflow-x-auto rounded-[20px] border border-card-br bg-card shadow-card">
            <table className="w-full min-w-3xl border-collapse text-left">
              <thead>
                <tr className="border-b border-hair bg-raise">
                  <th
                    scope="col"
                    className="px-7 py-5 text-xs font-bold tracking-[0.09em] text-text-muted"
                  >
                    FEATURE
                  </th>
                  {PRICING_TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className={`px-4 py-5 text-center text-[13.5px] font-bold ${
                        tier.isPopular
                          ? "text-primary-400"
                          : "text-text-primary"
                      }`}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, index) => (
                  <tr
                    key={row.id}
                    className={
                      index < COMPARISON_ROWS.length - 1
                        ? "border-b border-hair"
                        : ""
                    }
                  >
                    <th
                      scope="row"
                      className="px-7 py-4.5 text-[14.5px] font-normal text-text-primary"
                    >
                      {row.feature}
                    </th>
                    {row.values.map((value, valueIndex) => (
                      <td
                        key={PRICING_TIERS[valueIndex]?.id ?? valueIndex}
                        className="px-4 py-4.5"
                      >
                        <ComparisonValue value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mt-22">
          <h2 className="font-display text-[30px] font-medium tracking-[-0.018em] text-text-primary md:text-[40px]">
            Add on when you need it
          </h2>
          <p className="mt-2 mb-7.5 text-base text-text-secondary">
            Priced per engagement, never bundled into a number you did not ask
            for.
          </p>

          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
            {ADD_ONS.map((addOn) => (
              <div
                key={addOn.id}
                className="rounded-2xl border border-card-br bg-card p-7 shadow-card"
              >
                <div className="font-display text-[26px] font-medium tabular-nums text-text-primary">
                  {addOn.price}
                  {addOn.unit && (
                    <span className="text-sm text-text-muted">
                      {addOn.unit}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[15px] font-bold text-text-primary">
                  {addOn.title}
                </div>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-text-secondary">
                  {addOn.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-22 grid grid-cols-1 gap-4.5 md:grid-cols-2">
          {PRICING_FAQS.map((faq) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-card-br bg-card p-7.5 shadow-card"
            >
              <h3 className="text-[17px] font-bold text-text-primary">
                {faq.question}
              </h3>
              <p className="mt-2.5 text-[15.5px] leading-[1.7] text-text-secondary">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-22">
          <PanelCTA
            title="Get a real number."
            description="One call, one written proposal, one fixed price. Within three working days."
            primaryLabel="Request a proposal"
            primaryHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
