import { forwardRef } from "react";
import {
  FIELD_BASE,
  FIELD_ERROR,
  FIELD_LABEL,
  FIELD_SIZE,
  FIELD_STATE,
} from "./fieldClasses";
import type { AdminFieldSize } from "./types";

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
  /** `sm` matches the filter toolbars; `md` is the form default. */
  readonly fieldSize?: AdminFieldSize;
}

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
    fieldSize = "md",
    ...props
  },
  ref,
) {
  const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${selectId}-error`;
  const state = error ? "error" : "default";

  return (
    <div className={containerClassName}>
      <label htmlFor={selectId} className={FIELD_LABEL}>
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
          className={`${FIELD_BASE} ${FIELD_SIZE[fieldSize]} ${FIELD_STATE[state]} appearance-none pr-10 ${className}`}
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
        <p id={errorId} className={FIELD_ERROR}>
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
