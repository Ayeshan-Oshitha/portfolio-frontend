interface FieldGroupProps {
  readonly title?: string;
  readonly description?: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * A bordered cluster of related fields, used inside the editor forms and by
 * the repeatable-row editors (service features, pricing features, images).
 */
export default function FieldGroup({
  title,
  description,
  children,
  className = "",
}: FieldGroupProps) {
  return (
    <div
      className={`rounded-xl border border-border-subtle bg-surface-900 p-4 ${className}`}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm font-semibold tracking-tight text-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-xs text-text-muted">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </div>
  );
}
