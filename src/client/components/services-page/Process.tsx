import Eyebrow from "@/client/components/ui/Eyebrow";
import { PROCESS_HEADER, PROCESS_STEPS } from "@/client/data/services-page";

export default function Process() {
  return (
    <div>
      <div className="mb-13 max-w-2xl">
        {PROCESS_HEADER.badge && (
          <Eyebrow tone="ice" className="mb-4.5">
            {PROCESS_HEADER.badge}
          </Eyebrow>
        )}
        <h2 className="font-display text-[36px] leading-[1.08] font-medium tracking-[-0.018em] text-text-primary md:text-[48px]">
          {PROCESS_HEADER.title}
        </h2>
      </div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* The connecting thread, desktop only. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-6.5 right-15 left-15 hidden h-px bg-linear-to-r from-primary-400 to-accent-400 opacity-40 lg:block"
        />

        {PROCESS_STEPS.map((step) => (
          <div key={step.id} className="relative flex flex-col gap-3.5">
            <div className="flex h-13 w-13 items-center justify-center rounded-full fw-btn font-display text-[19px] font-medium tabular-nums shadow-btn">
              {step.step}
            </div>
            <h3 className="font-display text-[21px] font-medium tracking-[-0.018em] text-text-primary">
              {step.title}
            </h3>
            <p className="text-[14.5px] leading-[1.65] text-text-secondary">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
