import { useId, useState } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { FIELD_ERROR, FIELD_HINT, FIELD_LABEL } from "./fieldClasses";

interface MarkdownFieldProps {
  readonly label: string;
  readonly required?: boolean;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly error?: string;
  /** Supporting text under the field, shown only when there is no error. */
  readonly hint?: string;
  readonly height?: number;
  readonly containerClassName?: string;
}

// There's no upload wired behind these fields — unlike the article editor's
// content, nothing here turns an inserted `![]()` into a real image — so the
// image toolbar button would just leave a dead placeholder. Every other
// default command stays.
const TOOLBAR_COMMANDS = commands
  .getCommands()
  .filter((command) => command.name !== "image");

/**
 * A lighter markdown field than the article editor's `MDEditor` usage: edit
 * mode by default, with a manual toggle to check the rendered output before
 * saving, rather than a permanent split preview pane. Meant for forms with
 * several markdown fields on one screen (Projects' case study fields), where
 * a always-on live preview per field would eat too much space.
 */
export default function MarkdownField({
  label,
  required,
  value,
  onChange,
  error,
  hint,
  height = 220,
  containerClassName = "",
}: MarkdownFieldProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <div className={containerClassName} data-color-mode="light">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={fieldId} className={`${FIELD_LABEL} mb-0`}>
          {label}
          {required && (
            <span className="text-primary-400 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <button
          type="button"
          onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 rounded-sm"
        >
          {mode === "edit" ? "Preview" : "Edit"}
        </button>
      </div>

      <div
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
      >
        <MDEditor
          value={value}
          onChange={(next) => onChange(next ?? "")}
          height={height}
          preview={mode}
          visibleDragbar={false}
          commands={TOOLBAR_COMMANDS}
        />
      </div>

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
}
