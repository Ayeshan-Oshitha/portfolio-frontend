import Eyebrow from "@/client/components/ui/Eyebrow";
import BentoCard from "./BentoCard";
import { BENTO_CELLS, SERVICES_HEADER } from "@/client/data/services";

export default function Services() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-26 sm:px-6 lg:px-8">
      {/* Asymmetric header: title left, supporting line right. */}
      <div className="mb-11 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {SERVICES_HEADER.badge && (
            <Eyebrow className="mb-4.5">{SERVICES_HEADER.badge}</Eyebrow>
          )}
          <h2 className="font-display text-[36px] leading-[1.08] font-medium tracking-[-0.018em] whitespace-pre-line text-text-primary md:text-[50px]">
            {SERVICES_HEADER.title}
          </h2>
        </div>

        {SERVICES_HEADER.subtitle && (
          <p className="max-w-83 text-base leading-[1.65] text-text-secondary lg:mb-2">
            {SERVICES_HEADER.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
        {BENTO_CELLS.map((cell) => (
          <BentoCard key={cell.id} cell={cell} />
        ))}
      </div>
    </section>
  );
}
