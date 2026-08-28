interface StatBlockProps {
  readonly value: string;
  readonly label: string;
  /** Renders the trailing unit (`+`, `%`, `wk`) in an accent colour. */
  readonly suffix?: string;
  readonly suffixTone?: "ice" | "forest";
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "text-[26px]",
  md: "text-[34px]",
  lg: "text-[46px]",
};

export default function StatBlock({
  value,
  label,
  suffix,
  suffixTone = "forest",
  size = "lg",
  className = "",
}: StatBlockProps) {
  return (
    <div className={className}>
      <div
        className={`font-display font-medium leading-none tabular-nums text-text-primary ${SIZE_CLASSES[size]}`}
      >
        {value}
        {suffix && (
          <span
            className={
              suffixTone === "ice" ? "text-accent-400" : "text-primary-400"
            }
          >
            {suffix}
          </span>
        )}
      </div>
      <div className="mt-2.5 text-[13.5px] text-text-muted">{label}</div>
    </div>
  );
}
