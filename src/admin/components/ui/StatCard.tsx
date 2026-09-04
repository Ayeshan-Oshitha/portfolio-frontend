import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  readonly label: string;
  readonly value: number | undefined;
  readonly icon: LucideIcon;
  readonly href: string;
}

/** A dashboard tile summarizing one content type's count, linking to its list page. */
export default function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: StatCardProps) {
  return (
    <Link
      to={href}
      className="group flex items-center gap-4 rounded-2xl bg-surface-900 border border-border-subtle shadow-card p-5 transition-[transform,box-shadow,border-color] duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-panel hover:border-primary-200"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 border border-primary-100 text-primary-600 transition-colors duration-200 group-hover:bg-primary-100">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <div className="min-w-0">
        {/* `tabular-nums` keeps the row of tiles from jittering as counts
            load in and change width. */}
        <p className="admin-display text-[2.25rem] leading-none tabular-nums text-text-primary">
          {value ?? "—"}
        </p>
        <p className="mt-1.5 text-xs text-text-muted truncate">{label}</p>
      </div>
    </Link>
  );
}
