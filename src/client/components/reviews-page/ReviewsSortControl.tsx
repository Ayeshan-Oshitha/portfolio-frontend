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
    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-hair">
      <div className="flex items-center gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSortChange(option.value)}
            className={`cursor-pointer rounded-[9px] px-4 py-2 text-[13px] transition-colors duration-200 ${
              sort === option.value
                ? "fw-btn font-bold"
                : "border border-card-br bg-card font-semibold text-text-secondary hover:text-text-primary"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <span className="text-[13px] tabular-nums text-text-muted">
        {totalResults} review{totalResults !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
