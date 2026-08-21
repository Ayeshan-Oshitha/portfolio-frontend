import { useMemo } from "react";
import { X } from "lucide-react";
import Spinner from "@/portfolio/components/ui/Spinner";
import Select from "@/admin/components/ui/Select";
import { useTags } from "@/admin/hooks/useTags";
import { toErrorMessage } from "@/admin/api/ApiError";
import type { AdminTag } from "@/admin/types";

interface TagPickerProps {
  readonly label: string;
  /** The full set of selected ids — this replaces the article's tags outright. */
  readonly value: readonly string[];
  readonly onChange: (ids: string[]) => void;
  readonly hint?: string;
  readonly error?: string;
  readonly containerClassName?: string;
}

/**
 * The tag list is small and shared by every article, so it is fetched once per
 * mount rather than searched server-side. `pageSize` sits at the API's cap of
 * 100; beyond that the picker would need its own paging.
 */
const TAG_PAGE_SIZE = 100;

/**
 * Multi-select built from the existing primitives: selected tags are removable
 * chips and the `<select>` below offers only what is left. React Hook Form
 * drives it through `Controller`, since the value is an array rather than a
 * DOM field.
 */
export default function TagPicker({
  label,
  value,
  onChange,
  hint,
  error,
  containerClassName = "",
}: TagPickerProps) {
  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useTags({ pageSize: TAG_PAGE_SIZE });
  const tags: readonly AdminTag[] = useMemo(() => result?.items ?? [], [result]);
  const loadError = queryError ? toErrorMessage(queryError) : null;

  // Chips follow `value`'s order; an id with no matching tag is hidden but kept in the form value.
  const selected = useMemo(
    () =>
      value
        .map((id) => tags.find((tag) => tag.id === id))
        .filter((tag): tag is AdminTag => tag !== undefined),
    [value, tags],
  );

  const options = useMemo(
    () =>
      tags
        .filter((tag) => !value.includes(tag.id))
        .map((tag) => ({ value: tag.id, label: tag.name })),
    [tags, value],
  );

  const message = error ?? loadError;

  function add(id: string) {
    if (!id || value.includes(id)) return;
    onChange([...value, id]);
  }

  function remove(id: string) {
    onChange(value.filter((current) => current !== id));
  }

  return (
    <div className={containerClassName}>
      <span className="block text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-2">
        {label}
      </span>

      {isLoading ? (
        <div className="flex items-center gap-3 py-3 text-sm text-text-muted">
          <Spinner className="h-4 w-4" label="Loading tags" />
          Loading tags…
        </div>
      ) : (
        <>
          {selected.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-3">
              {selected.map((tag) => (
                <li key={tag.id}>
                  <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 text-xs font-medium tracking-wide uppercase rounded-md bg-primary-600/10 text-primary-400 border border-primary-600/20">
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => remove(tag.id)}
                      aria-label={`Remove ${tag.name}`}
                      className="rounded p-0.5 hover:bg-primary-600/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Resets to the placeholder after each pick — reads as an "add" action, not a selection. */}
          <Select
            label="Add a tag"
            placeholder={
              options.length === 0 ? "All tags added" : "Select a tag"
            }
            options={options}
            value=""
            disabled={options.length === 0}
            onChange={(event) => add(event.target.value)}
          />
        </>
      )}

      {hint && !message && (
        <p className="mt-2 text-xs text-text-muted">{hint}</p>
      )}

      {message && <p className="mt-2 text-xs text-danger-400">{message}</p>}
    </div>
  );
}
