type AlertVariant = "error" | "success" | "info";

interface AlertProps {
  readonly children: React.ReactNode;
  readonly variant?: AlertVariant;
  readonly className?: string;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: "bg-danger-500/8 text-danger-400 border-danger-500/40",
  success: "bg-success-500/8 text-success-400 border-success-500/40",
  info: "bg-surface-800 text-text-secondary border-border-default",
};

export default function Alert({
  children,
  variant = "error",
  className = "",
}: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
