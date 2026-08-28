import { ChevronRight } from "lucide-react";
import { HERO_DATA } from "@/client/data/hero";

export default function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-card-br bg-card py-1.5 pr-2.5 pl-2 text-[13px] font-semibold text-text-secondary shadow-card">
      <span className="rounded-full bg-primary-400/15 px-2.5 py-1 text-[11.5px] font-extrabold tracking-[0.05em] text-primary-400">
        {HERO_DATA.badgeTag}
      </span>
      <span>{HERO_DATA.badgeText}</span>
      <ChevronRight size={14} className="text-text-muted" aria-hidden="true" />
    </div>
  );
}
