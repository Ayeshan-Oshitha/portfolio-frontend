import StatBlock from "@/client/components/ui/StatBlock";
import type { Metric } from "@/client/types";

interface MetricsProps {
  readonly metrics: readonly Metric[];
  readonly className?: string;
}

/** The hairline-divided figures band. Shared by Home and About. */
export default function Metrics({ metrics, className = "" }: MetricsProps) {
  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="grid grid-cols-1 gap-10 border-y border-hair py-11 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {metrics.map((metric, index) => (
          <StatBlock
            key={metric.id}
            value={metric.value}
            suffix={metric.suffix}
            suffixTone={metric.suffixTone}
            label={metric.label}
            className={`lg:px-8.5 ${
              index < metrics.length - 1 ? "lg:border-r lg:border-hair" : ""
            }`}
          />
        ))}
      </div>
    </section>
  );
}
