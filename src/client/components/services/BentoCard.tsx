import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Chip from "@/client/components/ui/Chip";
import IconTile from "@/client/components/ui/IconTile";
import type { BentoCell } from "@/client/types";

interface BentoCardProps {
  readonly cell: BentoCell;
}

export default function BentoCard({ cell }: BentoCardProps) {
  const Icon = cell.icon;
  const isFeature = Boolean(cell.feature);

  return (
    <div
      className={`relative flex flex-col gap-4 overflow-hidden rounded-[20px] border p-8 ${
        isFeature
          ? "border-card-br bg-surface-900 shadow-card md:col-span-2 md:min-h-80"
          : "border-card-br bg-card shadow-card md:min-h-62"
      }`}
    >
      {isFeature && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-30 -right-20 h-105 w-105 fw-amb-1"
        />
      )}

      <div className="relative z-2 flex items-center gap-2.5">
        <IconTile>
          <Icon size={19} aria-hidden="true" />
        </IconTile>
        {cell.tag && (
          <span className="rounded-full bg-amber px-2.5 py-1 text-[11px] font-extrabold tracking-[0.05em] text-amber-ink">
            {cell.tag}
          </span>
        )}
      </div>

      <h3
        className={`relative z-2 font-display font-medium leading-tight tracking-[-0.018em] text-text-primary ${
          isFeature ? "text-[26px] sm:text-[28px]" : "text-[20px]"
        }`}
      >
        {cell.title}
      </h3>

      <p
        className={`relative z-2 leading-[1.65] text-text-secondary ${
          isFeature ? "max-w-md text-[15.5px]" : "text-[14.5px]"
        }`}
      >
        {cell.description}
      </p>

      {cell.chips && (
        <div className="relative z-2 mt-auto flex flex-wrap gap-2.5 pt-2">
          {cell.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      )}

      {cell.linkLabel && cell.href && (
        <Link
          to={cell.href}
          className="relative z-2 mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-accent-400 transition-colors duration-200 hover:text-accent-500"
        >
          {cell.linkLabel}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
