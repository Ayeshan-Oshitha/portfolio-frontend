type AlertVariant = "error" | "success" | "info";

interface AlertProps {
  readonly children: React.ReactNode;
  readonly variant?: AlertVariant;
  readonly className?: string;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: "bg-danger-500/10 text-danger-400 border-danger-500/30",
  success: "bg-success-500/10 text-success-400 border-success-500/30",
  info: "bg-primary-600/10 text-primary-400 border-primary-600/20",
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
