import Eyebrow from "@/client/components/ui/Eyebrow";
import { VALUES_DATA, VALUES_HEADER } from "@/client/data/about-page";

export default function CoreValues() {
  return (
    <div>
      <div className="mb-10 max-w-2xl">
        {VALUES_HEADER.badge && (
          <Eyebrow className="mb-4.5">{VALUES_HEADER.badge}</Eyebrow>
        )}
        <h2 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
          {VALUES_HEADER.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
        {VALUES_DATA.map((value, index) => (
          <div
            key={value.id}
            className="flex flex-col gap-3.5 rounded-[20px] border border-card-br bg-card p-8 shadow-card"
          >
            <span className="font-display text-[34px] leading-none font-medium tabular-nums text-primary-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-[21px] font-medium tracking-[-0.018em] text-text-primary">
              {value.title}
            </h3>
            <p className="text-[15px] leading-[1.68] text-text-secondary">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
