import {
  BarChart3,
  CalendarDays,
  LayoutGrid,
  Settings,
  UserPlus,
} from "lucide-react";

const NAV = [
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "clients", label: "Clients", icon: UserPlus },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const STATS = [
  {
    id: "projects",
    label: "ACTIVE PROJECTS",
    value: "12",
    delta: "↑ 3 this month",
  },
  { id: "mrr", label: "MRR", value: "$48.2k", delta: "↑ 11.4%" },
  { id: "uptime", label: "UPTIME", value: "99.98%", delta: "Last 90 days" },
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] as const;

/**
 * A mock of our own product, shown under the hero. Uses the `mock-*` tokens
 * so it can carry its own light/dark look independent of the surrounding
 * page theme. All figures are sample data.
 */
export default function ProductShowcase() {
  return (
    <div className="rounded-3xl border-2 border-hair-strong bg-card p-3 shadow-panel">
      <div className="overflow-hidden rounded-2xl border border-mock-line bg-mock-bg">
        {/* Browser chrome */}
        <div className="flex items-center gap-3.5 border-b border-mock-line px-5 py-3.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-mac-close" />
            <span className="h-2.5 w-2.5 rounded-full bg-mac-min" />
            <span className="h-2.5 w-2.5 rounded-full bg-mac-max" />
          </div>
          <div className="flex flex-1 justify-center">
            <span className="rounded-md bg-mock-fill px-4 py-1 text-[11.5px] text-mock-ink-3">
              app.frostwoodtech.com
            </span>
          </div>
          <div className="w-15" aria-hidden="true" />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-52 shrink-0 flex-col gap-1.5 border-r border-mock-line p-4 md:flex">
            <div className="flex items-center gap-2.5 rounded-[9px] border border-mock-forest/25 bg-mock-forest/15 px-3 py-2.5">
              <LayoutGrid
                size={15}
                className="text-mock-forest"
                aria-hidden="true"
              />
              <span className="text-[13px] font-bold text-mock-ink">
                Overview
              </span>
            </div>

            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 rounded-[9px] px-3 py-2.5"
                >
                  <Icon
                    size={15}
                    className="text-mock-ink-3"
                    aria-hidden="true"
                  />
                  <span className="text-[13px] font-medium text-mock-ink-2">
                    {item.label}
                  </span>
                </div>
              );
            })}

            <div className="mt-auto rounded-xl border border-mock-line bg-mock-fill p-3.5">
              <div className="text-xs font-bold text-mock-ink">Pro plan</div>
              <div className="mt-1 text-[11.5px] text-mock-ink-3">
                Renews 12 Mar
              </div>
            </div>
          </div>

          {/* Main panel */}
          <div className="min-w-0 flex-1 px-5 pt-6 pb-7 sm:px-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-display text-[23px] font-medium text-mock-ink">
                  Good morning, Oshitha
                </div>
                <div className="mt-1.5 text-[13px] text-mock-ink-3">
                  Here is how the studio is tracking this month.
                </div>
              </div>
              <div className="flex gap-2">
                <span className="rounded-lg border border-mock-line bg-mock-fill px-3.5 py-1.5 text-[12.5px] font-semibold text-mock-ink-2">
                  Last 30 days
                </span>
                <span className="rounded-lg bg-mock-ice px-3.5 py-1.5 text-[12.5px] font-bold text-mock-bg">
                  Export
                </span>
              </div>
            </div>

            <div className="mt-5.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-xl border border-mock-line bg-mock-fill px-4.5 py-4"
                >
                  <div className="text-[11.5px] font-semibold tracking-[0.05em] text-mock-ink-3">
                    {stat.label}
                  </div>
                  <div className="mt-2 font-display text-[30px] font-medium tabular-nums text-mock-ink">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[11.5px] text-mock-forest">
                    {stat.delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-mock-line bg-mock-fill px-5.5 pt-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="text-[13.5px] font-bold text-mock-ink">
                  Revenue
                </div>
                <div className="flex gap-4 text-[11.5px] text-mock-ink-3">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-mock-ice" />
                    SaaS
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-mock-forest" />
                    Client work
                  </span>
                </div>
              </div>

              <svg
                viewBox="0 0 700 132"
                preserveAspectRatio="none"
                className="mt-3 block h-33 w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="fwIce" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--fw-chart-ice)"
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--fw-chart-ice)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient id="fwForest" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--fw-chart-forest)"
                      stopOpacity="0.45"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--fw-chart-forest)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <g className="text-mock-ice">
                  <path
                    d="M0 104 L58 96 L116 100 L175 82 L233 88 L291 66 L350 70 L408 52 L466 46 L525 34 L583 30 L641 18 L700 12 L700 132 L0 132Z"
                    fill="url(#fwIce)"
                  />
                  <path
                    d="M0 104 L58 96 L116 100 L175 82 L233 88 L291 66 L350 70 L408 52 L466 46 L525 34 L583 30 L641 18 L700 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </g>

                <g className="text-mock-forest">
                  <path
                    d="M0 122 L58 118 L116 120 L175 112 L233 114 L291 104 L350 108 L408 98 L466 96 L525 88 L583 90 L641 80 L700 76 L700 132 L0 132Z"
                    fill="url(#fwForest)"
                  />
                  <path
                    d="M0 122 L58 118 L116 120 L175 112 L233 114 L291 104 L350 108 L408 98 L466 96 L525 88 L583 90 L641 80 L700 76"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </g>
              </svg>

              <div className="flex justify-between pt-1.5 text-[10.5px] text-mock-ink-3">
                {MONTHS.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
