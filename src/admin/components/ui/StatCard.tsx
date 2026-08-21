import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  readonly label: string;
  readonly value: number | undefined;
  readonly icon: LucideIcon;
  readonly href: string;
}

/** A dashboard tile summarizing one content type's count, linking to its list page. */
export default function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-4 rounded-2xl bg-surface-900/60 border border-border-subtle shadow-sm p-5 transition-colors duration-200 hover:bg-surface-800/60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="text-2xl font-bold text-text-primary leading-tight">
          {value ?? "—"}
        </p>
        <p className="text-xs text-text-muted truncate">{label}</p>
      </div>
    </Link>
  );
}
