import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import Button from "@/portfolio/components/ui/Button";
import type { ServiceFeatureValues } from "@/admin/validation/serviceSchemas";

interface ServiceFeaturesEditorProps {
  readonly value: readonly ServiceFeatureValues[];
  readonly onChange: (next: ServiceFeatureValues[]) => void;
  /** Per-row message for the title field, indexed alongside `value`. */
  readonly errors?: readonly (string | undefined)[];
  readonly disabled?: boolean;
}

const ROW_INPUT_CLASSES =
  "w-full px-3 py-2 text-sm text-text-primary bg-surface-950 border rounded-lg placeholder:text-text-muted transition-colors duration-200 focus:outline-none focus:ring-1";

const ROW_STATE_CLASSES = {
  default:
    "border-border-default focus:border-primary-500 focus:ring-primary-500/30",
  error: "border-danger-500 focus:border-danger-500 focus:ring-danger-500/30",
} as const;

/**
 * The "what's included" list on a service page. Features are a sub-resource on
 * the API — they need a saved service id — so this edits a plain local array
 * and the modal diffs it against the server's copy once the service itself is
 * saved.
 *
 * Order is the array order; `sortOrder` is assigned from the index on save,
 * which keeps the numbering dense however many rows come and go.
 */
export default function ServiceFeaturesEditor({
  value,
  onChange,
  errors,
  disabled = false,
}: ServiceFeaturesEditorProps) {
  function patch(index: number, changes: Partial<ServiceFeatureValues>) {
    onChange(
      value.map((row, at) => (at === index ? { ...row, ...changes } : row)),
    );
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;

    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, at) => at !== index));
  }

  function add() {
    onChange([...value, { title: "", description: "", iconName: "" }]);
  }

  return (
    <div>
      <p className="block text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-2">
        Features
      </p>

      {value.length === 0 ? (
        <p className="text-sm text-text-muted mb-3">
          No features yet — the service page will show an empty list.
        </p>
      ) : (
        <ul className="space-y-3 mb-3">
          {value.map((row, index) => {
            const error = errors?.[index];

            return (
              <li
                key={index}
                className="p-3 rounded-lg border border-border-subtle bg-surface-900/40"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={row.title}
                      disabled={disabled}
                      placeholder="Responsive design"
                      aria-label={`Feature ${index + 1} title`}
                      aria-invalid={error ? true : undefined}
                      onChange={(event) =>
                        patch(index, { title: event.target.value })
                      }
                      className={`${ROW_INPUT_CLASSES} ${
                        ROW_STATE_CLASSES[error ? "error" : "default"]
                      }`}
                    />

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={row.description ?? ""}
                        disabled={disabled}
                        placeholder="Description (optional)"
                        aria-label={`Feature ${index + 1} description`}
                        onChange={(event) =>
                          patch(index, { description: event.target.value })
                        }
                        className={`${ROW_INPUT_CLASSES} ${ROW_STATE_CLASSES.default} flex-1`}
                      />

                      <input
                        type="text"
                        value={row.iconName ?? ""}
                        disabled={disabled}
                        placeholder="Lucide icon"
                        aria-label={`Feature ${index + 1} icon name`}
                        onChange={(event) =>
                          patch(index, { iconName: event.target.value })
                        }
                        className={`${ROW_INPUT_CLASSES} ${ROW_STATE_CLASSES.default} w-40 shrink-0`}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={disabled || index === 0}
                      aria-label={`Move feature ${index + 1} up`}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={disabled || index === value.length - 1}
                      aria-label={`Move feature ${index + 1} down`}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={disabled}
                      aria-label={`Remove feature ${index + 1}`}
                      className="p-2 rounded-lg text-text-muted hover:text-danger-400 hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="mt-2 text-xs text-danger-400">{error}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        disabled={disabled}
        icon={<Plus className="h-4 w-4" />}
        iconPosition="left"
      >
        Add feature
      </Button>
    </div>
  );
}
