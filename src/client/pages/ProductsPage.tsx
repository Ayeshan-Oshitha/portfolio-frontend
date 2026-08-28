import Eyebrow from "@/client/components/ui/Eyebrow";
import PanelCTA from "@/client/components/ui/PanelCTA";

export default function ProductsPage() {
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
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow align="center" tone="ice" className="mb-5">
            Products
          </Eyebrow>
          <h1 className="font-display text-[42px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[56px] lg:text-[66px]">
            Coming soon.
          </h1>
          <p className="mt-5.5 text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
            We&apos;re building out our product lineup. Check back soon, or
            get in touch to hear what&apos;s in the works.
          </p>
        </div>

        <div className="mt-22">
          <PanelCTA
            title="Want to know more?"
            description="Reach out and we'll walk you through what's coming."
            primaryLabel="Contact us"
            primaryHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
