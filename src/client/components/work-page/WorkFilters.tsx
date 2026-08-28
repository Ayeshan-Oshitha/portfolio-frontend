import { ChevronDown, Search } from "lucide-react";
import { PROJECT_CATEGORIES } from "@/client/data/projects";

interface WorkFiltersProps {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly selectedCategories: readonly string[];
  readonly onCategoryToggle: (category: string) => void;
  readonly sortOrder: "newest" | "oldest";
  readonly onSortChange: (order: "newest" | "oldest") => void;
  readonly totalResults: number;
}

export default function WorkFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  sortOrder,
  onSortChange,
  totalResults,
}: WorkFiltersProps) {
  const allActive = selectedCategories.length === 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-card-br bg-card p-4 shadow-card xl:flex-row xl:items-center xl:justify-between">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            selectedCategories.forEach((category) => onCategoryToggle(category))
          }
          aria-pressed={allActive}
          className={`cursor-pointer rounded-[9px] px-4.5 py-2.5 text-[13.5px] transition-colors duration-200 ${
            allActive
              ? "fw-btn font-bold"
              : "font-semibold text-text-secondary hover:text-text-primary"
          }`}
        >
          All work
        </button>

        {PROJECT_CATEGORIES.map((category) => {
          const isActive = selectedCategories.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryToggle(category)}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-[9px] px-4.5 py-2.5 text-[13.5px] transition-colors duration-200 ${
                isActive
                  ? "fw-btn font-bold"
                  : "font-semibold text-text-secondary hover:text-text-primary"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative">
          <Search
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
            className="w-full rounded-[9px] border border-raise-br bg-raise py-2.5 pr-4 pl-10 text-[13.5px] text-text-primary placeholder:text-text-muted focus:border-accent-400 focus:outline-none sm:w-58"
          />
        </div>

        <div className="relative">
          <select
            value={sortOrder}
            onChange={(event) =>
              onSortChange(event.target.value as "newest" | "oldest")
            }
            aria-label="Sort projects"
            className="w-full cursor-pointer appearance-none rounded-[9px] border border-raise-br bg-raise py-2.5 pr-10 pl-4 text-[13.5px] font-semibold text-text-secondary focus:border-accent-400 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <ChevronDown
            size={13}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-muted"
          />
        </div>

        <span className="shrink-0 text-[13px] tabular-nums text-text-muted sm:ml-1">
          {totalResults} {totalResults === 1 ? "project" : "projects"}
        </span>
      </div>
    </div>
  );
}
