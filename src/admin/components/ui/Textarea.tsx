import { forwardRef } from "react";
import {
  FIELD_BASE,
  FIELD_ERROR,
  FIELD_HINT,
  FIELD_LABEL,
  FIELD_STATE,
} from "./fieldClasses";

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  readonly label: string;
  readonly error?: string;
  /** Supporting text under the field, shown only when there is no error. */
  readonly hint?: string;
  readonly containerClassName?: string;
}

/**
 * The multi-line counterpart to `Input`. It takes the shared field classes
 * but sets its own vertical padding rather than using `FIELD_SIZE` — those
 * are fixed heights, which a resizable multi-line control cannot use.
 */
const TEXTAREA_SIZE = "px-3.5 py-3 resize-y";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      hint,
      id,
      required,
      rows = 3,
      className = "",
      containerClassName = "",
      ...props
    },
    ref,
  ) {
    const textareaId =
      id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;
    const state = error ? "error" : "default";

    return (
      <div className={containerClassName}>
        <label htmlFor={textareaId} className={FIELD_LABEL}>
          {label}
          {required && (
            <span className="text-primary-400 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <textarea
          {...props}
          id={textareaId}
          ref={ref}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`${FIELD_BASE} ${TEXTAREA_SIZE} ${FIELD_STATE[state]} ${className}`}
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
  },
);

export default Textarea;
