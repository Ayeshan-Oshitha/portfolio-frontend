import type { BadgeVariant } from "@/client/types";

interface BadgeProps {
  readonly children: React.ReactNode;
  readonly variant?: BadgeVariant;
  readonly className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "fw-icon-bg text-icon-fg border border-hair",
  outline: "bg-transparent text-text-secondary border border-border-default",
  subtle: "bg-raise text-text-secondary border border-raise-br",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-[11px] font-bold tracking-[0.04em] uppercase ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
