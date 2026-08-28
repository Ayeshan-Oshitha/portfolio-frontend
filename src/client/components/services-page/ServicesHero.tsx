import Eyebrow from "@/client/components/ui/Eyebrow";
import {
  SERVICES_PAGE_HEADER,
  SERVICES_PAGE_STATS,
} from "@/client/data/services-page";

export default function ServicesHero() {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
      <div className="max-w-2xl">
        {SERVICES_PAGE_HEADER.badge && (
          <Eyebrow className="mb-5">{SERVICES_PAGE_HEADER.badge}</Eyebrow>
        )}

        <h1 className="font-display text-[40px] leading-[1.05] font-medium tracking-[-0.018em] whitespace-pre-line text-text-primary sm:text-[52px] lg:text-[68px]">
          {SERVICES_PAGE_HEADER.title}
        </h1>

        {SERVICES_PAGE_HEADER.subtitle && (
          <p className="mt-6 max-w-xl text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
            {SERVICES_PAGE_HEADER.subtitle}
          </p>
        )}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-4.5 rounded-[18px] border border-card-br bg-card p-8 shadow-card lg:w-65">
        {SERVICES_PAGE_STATS.map((stat, index) => (
          <div key={stat.id}>
            {index > 0 && (
              <div aria-hidden="true" className="mb-4.5 h-px bg-hair" />
            )}
            <div className="font-display text-[34px] leading-none font-medium tabular-nums text-text-primary">
              {stat.value}
            </div>
            <div className="mt-1.5 text-[13.5px] text-text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
