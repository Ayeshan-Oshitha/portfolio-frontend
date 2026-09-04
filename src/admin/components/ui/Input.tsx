import { forwardRef } from "react";
import {
  FIELD_BASE,
  FIELD_ERROR,
  FIELD_HINT,
  FIELD_LABEL,
  FIELD_SIZE,
  FIELD_STATE,
} from "./fieldClasses";
import type { AdminFieldSize } from "./types";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  readonly label: string;
  readonly error?: string;
  /** Supporting text under the field, shown only when there is no error. */
  readonly hint?: string;
  readonly containerClassName?: string;
  /** `sm` matches the filter toolbars; `md` is the form default. */
  readonly fieldSize?: AdminFieldSize;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    id,
    required,
    className = "",
    containerClassName = "",
    fieldSize = "md",
    ...props
  },
  ref,
) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const state = error ? "error" : "default";

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className={FIELD_LABEL}>
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
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`${FIELD_BASE} ${FIELD_SIZE[fieldSize]} ${FIELD_STATE[state]} ${className}`}
      />

      {error ? (
        <p id={errorId} className={FIELD_ERROR}>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={FIELD_HINT}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
