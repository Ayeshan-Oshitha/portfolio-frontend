import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export interface ContentBreakdownItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly value: number | undefined;
}

export interface ContentBreakdownTab {
  readonly value: string;
  readonly label: string;
}

interface ContentBreakdownChartProps {
  readonly items: readonly ContentBreakdownItem[];
  readonly tabs: readonly ContentBreakdownTab[];
  readonly activeTab: string;
  readonly onTabChange: (value: string) => void;
}

/**
 * A horizontal bar chart comparing counts across content types — replaces a
 * grid of identical stat tiles with an actual magnitude comparison. One hue
 * (the brand green) rather than a color per row: these are ranked counts of
 * the same kind of thing, not distinct series that need telling apart, so a
 * legend/categorical palette would be answering a question nobody's asking.
 */
export default function ContentBreakdownChart({
  items,
  tabs,
  activeTab,
  onTabChange,
}: ContentBreakdownChartProps) {
  const max = Math.max(1, ...items.map((item) => item.value ?? 0));

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-900 p-4 shadow-card sm:p-5">
      <div className="mb-3 flex justify-end">
        <div
          role="tablist"
          aria-label="Filter by status"
          className="inline-flex items-center gap-0.5 rounded-lg bg-surface-800 p-0.5"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.value)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-surface-900 text-text-primary shadow-card"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        {items.map(({ label, href, icon: Icon, value }) => {
          const pct = ((value ?? 0) / max) * 100;

          return (
            <Link
              key={label}
              to={href}
              className="group grid grid-cols-[9rem_1fr_2.5rem] items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-surface-800 sm:grid-cols-[10rem_1fr_2.5rem]"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm text-text-secondary group-hover:text-text-primary">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </span>

              <span className="h-2.5 min-w-0 overflow-hidden rounded-full bg-primary-100">
                <span
                  className="block h-full rounded-full bg-primary-600 transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.max(pct, value ? 3 : 0)}%` }}
                />
              </span>

              <span className="text-right text-sm font-semibold tabular-nums text-text-primary">
                {value ?? "—"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
