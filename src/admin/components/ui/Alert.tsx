import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  readonly children: React.ReactNode;
  readonly variant?: AlertVariant;
  readonly className?: string;
}

/**
 * A left accent rule plus an icon carries the severity, so the message reads
 * at a glance without relying on colour alone — the previous version was a
 * tinted box whose meaning was only in its border colour.
 */
const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error:
    "bg-danger-50 text-danger-500 border-danger-400/40 border-l-danger-500",
  success:
    "bg-success-50 text-success-500 border-success-400/40 border-l-success-500",
  warning:
    "bg-warning-50 text-warning-500 border-warning-400/40 border-l-warning-500",
  info: "bg-accent-50 text-accent-600 border-accent-200 border-l-accent-500",
};

const VARIANT_ICONS: Record<AlertVariant, LucideIcon> = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export default function Alert({
  children,
  variant = "error",
  className = "",
}: AlertProps) {
  const Icon = VARIANT_ICONS[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-lg border border-l-2 px-3.5 py-3 text-sm ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
