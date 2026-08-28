import {
  Braces,
  Cloud,
  Database,
  Layers,
  MonitorSmartphone,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Chip from "@/client/components/ui/Chip";
import Eyebrow from "@/client/components/ui/Eyebrow";
import IconTile from "@/client/components/ui/IconTile";
import {
  TECHNOLOGIES_HEADER,
  TECHNOLOGY_CATEGORIES,
} from "@/client/data/technologies";

/**
 * Category icons live here rather than in the data file: the technology data
 * carries brand SVG *files* (white-on-transparent for several marks), which
 * would disappear on a light background. The design solves that by naming the
 * tools as text chips under a themed category icon instead.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Languages: Braces,
  Frontend: MonitorSmartphone,
  Backend: Server,
  Databases: Database,
  "Cloud & DevOps": Cloud,
  "Tools & Platforms": Layers,
};

export default function Technologies() {
  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-15">
        <div className="max-w-2xl">
          {TECHNOLOGIES_HEADER.badge && (
            <Eyebrow tone="ice" className="mb-4.5">
              Our toolkit
            </Eyebrow>
          )}
          <h2 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
            The technologies we build on.
          </h2>
        </div>
        <p className="max-w-85 text-[15.5px] leading-[1.65] text-text-secondary lg:mb-1.5">
          Boring, well-documented tools with long support horizons. We would
          rather be predictable than fashionable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
        {TECHNOLOGY_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.category] ?? Layers;

          return (
            <div
              key={category.category}
              className="rounded-[20px] border border-card-br bg-card p-7.5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <IconTile size="sm">
                  <Icon size={16} aria-hidden="true" />
                </IconTile>
                <h3 className="text-xs font-bold tracking-[0.09em] text-text-muted uppercase">
                  {category.category}
                </h3>
              </div>

              <div className="mt-4.5 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <Chip key={item.name}>{item.name}</Chip>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
