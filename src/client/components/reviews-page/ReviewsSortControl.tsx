import type { ReviewSort } from "@/client/types";

interface ReviewsSortControlProps {
  readonly sort: ReviewSort;
  readonly onSortChange: (sort: ReviewSort) => void;
  readonly totalResults: number;
}

const SORT_OPTIONS: { readonly value: ReviewSort; readonly label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "rating", label: "Highest Rated" },
  { value: "country", label: "Country" },
];

export default function ReviewsSortControl({
  sort,
  onSortChange,
  totalResults,
}: ReviewsSortControlProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-border-subtle">
      <div className="flex items-center gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSortChange(option.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
              sort === option.value
                ? "bg-primary-600/20 text-primary-400 border-primary-500/40"
                : "bg-surface-900 text-text-secondary border-border-default hover:text-text-primary hover:border-text-muted"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <span className="text-xs font-semibold tracking-wider uppercase text-text-muted">
        {totalResults} review{totalResults !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
