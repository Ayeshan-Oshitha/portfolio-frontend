import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import type { PricingFeatureValues } from "@/admin/validation/pricingSchemas";
import { IconButton, Button } from "@/admin/components/ui";

interface PricingFeaturesEditorProps {
  readonly value: readonly PricingFeatureValues[];
  readonly onChange: (next: PricingFeatureValues[]) => void;
  /** Per-row message, indexed alongside `value`. */
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
 * The bullet list shown on a pricing card. Features are a sub-resource on the
 * API — they need a saved plan id — so this edits a plain local array and the
 * modal diffs it against the server's copy once the plan itself is saved.
 *
 * Order is the array order; `sortOrder` is assigned from the index on save,
 * which keeps the numbering dense however many rows come and go.
 */
export default function PricingFeaturesEditor({
  value,
  onChange,
  errors,
  disabled = false,
}: PricingFeaturesEditorProps) {
  function patch(index: number, changes: Partial<PricingFeatureValues>) {
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
    onChange([...value, { text: "", isIncluded: true }]);
  }

  return (
    <div>
      <p className="block mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
        Features
      </p>

      {value.length === 0 ? (
        <p className="text-sm text-text-muted mb-3">
          No features yet — the card will show an empty list.
        </p>
      ) : (
        <ul className="space-y-2 mb-3">
          {value.map((row, index) => {
            const error = errors?.[index];

            return (
              <li key={index}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.text}
                    disabled={disabled}
                    placeholder="Up to 5 pages"
                    aria-label={`Feature ${index + 1}`}
                    aria-invalid={error ? true : undefined}
                    onChange={(event) =>
                      patch(index, { text: event.target.value })
                    }
                    className={`${ROW_INPUT_CLASSES} ${
                      ROW_STATE_CLASSES[error ? "error" : "default"]
                    }`}
                  />

                  <label className="flex shrink-0 items-center gap-2 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.isIncluded}
                      disabled={disabled}
                      onChange={(event) =>
                        patch(index, { isIncluded: event.target.checked })
                      }
                      className="h-4 w-4 rounded border-border-default bg-surface-950 accent-primary-600 cursor-pointer"
                    />
                    Included
                  </label>

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
                  <p className="mt-1 text-xs text-danger-400">{error}</p>
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
