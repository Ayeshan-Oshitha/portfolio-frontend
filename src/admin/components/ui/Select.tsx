import { forwardRef } from "react";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  readonly label: string;
  readonly options: readonly SelectOption[];
  /** Rendered as an empty-value option at the top. */
  readonly placeholder?: string;
  readonly error?: string;
  readonly containerClassName?: string;
}

/** The `<select>` counterpart to `Input`, sharing its field styling. */
const BASE_SELECT_CLASSES =
  "w-full appearance-none px-4 py-3 pr-10 text-sm text-text-primary bg-surface-950 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed";

const STATE_CLASSES = {
  default:
    "border-border-default focus:border-primary-500 focus:ring-primary-500/30",
  error: "border-danger-500 focus:border-danger-500 focus:ring-danger-500/30",
} as const;

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    options,
    placeholder,
    error,
    id,
    required,
    className = "",
    containerClassName = "",
    ...props
  },
  ref,
) {
  const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${selectId}-error`;
  const state = error ? "error" : "default";

  return (
    <div className={containerClassName}>
      <label
        htmlFor={selectId}
        className="block text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-2"
      >
        {label}
        {required && (
          <span className="text-primary-400 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <select
          {...props}
          id={selectId}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${BASE_SELECT_CLASSES} ${STATE_CLASSES[state]} ${className}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-xs text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
