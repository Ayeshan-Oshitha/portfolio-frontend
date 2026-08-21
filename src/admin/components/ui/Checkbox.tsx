import { forwardRef } from "react";

interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type"
> {
  readonly label: string;
  /** Explanatory line under the label. */
  readonly hint?: string;
  readonly error?: string;
  readonly containerClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, id, className = "", containerClassName = "", ...props },
  ref,
) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;

  return (
    <div className={containerClassName}>
      <div className="flex items-start gap-3">
        <input
          {...props}
          type="checkbox"
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`mt-0.5 h-4 w-4 shrink-0 rounded border-border-default bg-surface-950 accent-primary-600 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${className}`}
        />

        <label htmlFor={inputId} className="cursor-pointer">
          <span className="block text-sm font-medium text-text-primary">
            {label}
          </span>
          {hint && (
            <span className="block mt-0.5 text-xs text-text-muted">{hint}</span>
          )}
        </label>
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-xs text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Checkbox;
