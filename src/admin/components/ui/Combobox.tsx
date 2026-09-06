import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { FIELD_BASE, FIELD_ERROR, FIELD_LABEL, FIELD_SIZE, FIELD_STATE } from "./fieldClasses";
import type { SelectOption } from "./Select";
import type { AdminFieldSize } from "./types";

interface ComboboxProps {
  readonly label: string;
  readonly options: readonly SelectOption[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  /** Adds a leading "clear" row (value `""`, labelled `placeholder`) — for an optional filter, not a required form field. */
  readonly allowClear?: boolean;
  readonly containerClassName?: string;
  /** `sm` matches the filter toolbars; `md` is the form default. */
  readonly fieldSize?: AdminFieldSize;
}

/**
 * A searchable dropdown for long option lists (country pickers, ~250 items)
 * where a native `<select>`'s unstyled, unfilterable popup stops being
 * usable. Built on the same field tokens as `Select`/`Input` rather than a
 * new dependency — no headless-UI/combobox library exists in this repo yet,
 * and this is the only caller.
 */
export default function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  error,
  required,
  disabled,
  allowClear = false,
  containerClassName = "",
  fieldSize = "md",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const fieldId = useId();
  const listId = `${fieldId}-listbox`;
  const errorId = `${fieldId}-error`;
  const state = error ? "error" : "default";

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? options.filter((option) => option.label.toLowerCase().includes(q))
      : options;

    // The clear row only makes sense while browsing, not mid-search.
    return allowClear && !q
      ? [{ value: "", label: placeholder }, ...matches]
      : matches;
  }, [options, query, allowClear, placeholder]);

  /** Opening always starts from a clean search with the current selection highlighted. */
  function openDropdown() {
    setQuery("");
    setHighlighted(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function select(option: SelectOption) {
    onChange(option.value);
    setOpen(false);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted(
        (prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[highlighted];
      if (option) select(option);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className={containerClassName} ref={containerRef}>
      <label id={`${fieldId}-label`} className={FIELD_LABEL}>
        {label}
        {required && (
          <span className="text-primary-400 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${fieldId}-label ${fieldId}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => (open ? setOpen(false) : openDropdown())}
          className={`${FIELD_BASE} ${FIELD_SIZE[fieldSize]} ${FIELD_STATE[state]} appearance-none pr-10 text-left ${
            selected ? "" : "text-text-muted"
          }`}
        >
          <span className="block truncate">
            {selected ? selected.label : placeholder}
          </span>
        </button>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />

        {open && (
          <div
            className="absolute z-20 mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-900 shadow-panel motion-safe:animate-[fade-in-up_0.12s_ease-out]"
            role="presentation"
          >
            <div className="relative border-b border-border-subtle p-2">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                autoFocus
                type="text"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlighted(0);
                }}
                onKeyDown={handleSearchKeyDown}
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                className={`${FIELD_BASE} h-9 pl-8 pr-3 ${FIELD_STATE.default}`}
              />
            </div>

            <ul
              id={listId}
              role="listbox"
              aria-labelledby={`${fieldId}-label`}
              className="max-h-60 overflow-y-auto py-1"
            >
              {filtered.length === 0 ? (
                <li className="px-3.5 py-2.5 text-sm text-text-muted">
                  No matches.
                </li>
              ) : (
                filtered.map((option, index) => (
                  <li key={option.value} role="option" aria-selected={option.value === value}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => select(option)}
                      onMouseEnter={() => setHighlighted(index)}
                      className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors duration-100 ${
                        index === highlighted
                          ? "bg-surface-800 text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {option.value === value && (
                        <Check
                          className="h-3.5 w-3.5 shrink-0 text-primary-500"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className={FIELD_ERROR}>
          {error}
        </p>
      )}
    </div>
  );
}
