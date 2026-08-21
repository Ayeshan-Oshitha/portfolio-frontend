import { forwardRef } from "react";

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  readonly label: string;
  readonly error?: string;
  readonly containerClassName?: string;
}

/** The multi-line counterpart to `Input`, sharing its field styling. */
const BASE_TEXTAREA_CLASSES =
  "w-full px-4 py-3 text-sm text-text-primary bg-surface-950 border rounded-lg placeholder:text-text-muted transition-colors duration-200 resize-y focus:outline-none focus:ring-1";

const STATE_CLASSES = {
  default:
    "border-border-default focus:border-primary-500 focus:ring-primary-500/30",
  error: "border-danger-500 focus:border-danger-500 focus:ring-danger-500/30",
} as const;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
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
    const state = error ? "error" : "default";

    return (
      <div className={containerClassName}>
        <label
          htmlFor={textareaId}
          className="block text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-2"
        >
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
          aria-describedby={error ? errorId : undefined}
          className={`${BASE_TEXTAREA_CLASSES} ${STATE_CLASSES[state]} ${className}`}
        />

        {error && (
          <p id={errorId} className="mt-2 text-xs text-danger-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default Textarea;
