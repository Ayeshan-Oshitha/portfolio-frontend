import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import type { ServiceFeatureValues } from "@/admin/validation/serviceSchemas";
import { IconButton, Button } from "@/admin/components/ui";

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
      <p className="block mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
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
                    <IconButton
                      icon={<ArrowUp className="h-4 w-4" />}
                      label={`Move feature ${index + 1} up`}
                      onClick={() => move(index, -1)}
                      disabled={disabled || index === 0}
                    />
                    <IconButton
                      icon={<ArrowDown className="h-4 w-4" />}
                      label={`Move feature ${index + 1} down`}
                      onClick={() => move(index, 1)}
                      disabled={disabled || index === value.length - 1}
                    />
                    <IconButton
                      icon={<X className="h-4 w-4" />}
                      label={`Remove feature ${index + 1}`}
                      onClick={() => remove(index)}
                      disabled={disabled}
                      tone="danger"
                    />
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
