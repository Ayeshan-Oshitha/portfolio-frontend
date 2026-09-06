import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type StatCardTone = "brand" | "info" | "success" | "warning";

/* Written out per tone rather than interpolated: Tailwind scans for whole
   class names, so `bg-${tone}-50` would never be generated. */
const TONE_CLASSES: Record<StatCardTone, string> = {
  brand:
    "bg-primary-50 border-primary-100 text-primary-600 group-hover:bg-primary-100",
  info: "bg-accent-50 border-accent-100 text-accent-600 group-hover:bg-accent-100",
  success:
    "bg-success-50 border-success-400/20 text-success-500 group-hover:bg-success-50",
  warning:
    "bg-warning-50 border-warning-400/30 text-warning-500 group-hover:bg-warning-50",
};

interface StatCardProps {
  readonly label: string;
  readonly value: number | undefined;
  readonly icon: LucideIcon;
  readonly href: string;
  readonly tone?: StatCardTone;
}

/** A dashboard tile summarizing one content type's count, linking to its list page. */
export default function StatCard({
  label,
  value,
  icon: Icon,
  href,
  tone = "brand",
}: StatCardProps) {
  return (
    <Link
      to={href}
      className="group flex items-center gap-3 rounded-xl bg-surface-900 border border-border-subtle shadow-card p-3.5 transition-[transform,box-shadow,border-color] duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-panel hover:border-primary-200"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200 ${TONE_CLASSES[tone]}`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <div className="min-w-0">
        {/* `tabular-nums` keeps the row of tiles from jittering as counts
            load in and change width. */}
        <p className="admin-display text-2xl leading-none tabular-nums text-text-primary">
          {value ?? "—"}
        </p>
        <p className="mt-1 text-xs text-text-muted truncate">{label}</p>
      </div>
    </Link>
  );
}
