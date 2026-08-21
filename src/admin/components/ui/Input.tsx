import { forwardRef } from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  readonly label: string;
  readonly error?: string;
  readonly containerClassName?: string;
}

/** Matches the site's existing field styling (see contact/FormField.tsx). */
const BASE_INPUT_CLASSES =
  "w-full px-4 py-3 text-sm text-text-primary bg-surface-950 border rounded-lg placeholder:text-text-muted transition-colors duration-200 focus:outline-none focus:ring-1";

const STATE_CLASSES = {
  default:
    "border-border-default focus:border-primary-500 focus:ring-primary-500/30",
  error: "border-danger-500 focus:border-danger-500 focus:ring-danger-500/30",
} as const;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    id,
    required,
    className = "",
    containerClassName = "",
    ...props
  },
  ref,
) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;
  const state = error ? "error" : "default";

  return (
    <div className={containerClassName}>
      <label
        htmlFor={inputId}
        className="block text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-2"
      >
        {label}
        {required && (
          <span className="text-primary-400 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        {...props}
        id={inputId}
        ref={ref}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${BASE_INPUT_CLASSES} ${STATE_CLASSES[state]} ${className}`}
      />

      {error && (
        <p id={errorId} className="mt-2 text-xs text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
