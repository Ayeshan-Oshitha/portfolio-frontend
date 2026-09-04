interface ChipProps {
  readonly children: React.ReactNode;
  /** `tag` is the tinted category label; `plain` is the neutral tech pill. */
  readonly variant?: "plain" | "tag";
  readonly className?: string;
}

const VARIANT_CLASSES: Record<"plain" | "tag", string> = {
  plain:
    "px-3.5 py-2 rounded-lg text-[13px] font-semibold text-text-secondary bg-raise border border-raise-br",
  tag: "px-3 py-1.5 rounded-md text-[11px] font-bold tracking-[0.04em] uppercase text-icon-fg fw-icon-bg border border-hair",
};

export default function Chip({
  children,
  variant = "plain",
  className = "",
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
