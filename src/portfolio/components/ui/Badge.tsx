import type { BadgeVariant } from "../../types";

interface BadgeProps {
  readonly children: React.ReactNode;
  readonly variant?: BadgeVariant;
  readonly className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:
    "bg-surface-800 text-text-secondary border border-border-subtle",
  outline:
    "bg-transparent text-text-secondary border border-border-default",
  subtle:
    "bg-primary-600/10 text-primary-400 border border-primary-600/20",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-md ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
