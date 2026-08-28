import { Search } from "lucide-react";
import { BLOG_CATEGORIES } from "@/client/data/blog-page";

interface BlogFiltersProps {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly selectedCategory: string | null;
  readonly onCategorySelect: (category: string | null) => void;
}

export default function BlogFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
}: BlogFiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategorySelect(null)}
          aria-pressed={selectedCategory === null}
          className={`cursor-pointer rounded-[9px] px-4.5 py-2.5 text-[13.5px] transition-colors duration-200 ${
            selectedCategory === null
              ? "fw-btn font-bold"
              : "border border-card-br bg-card font-semibold text-text-secondary hover:text-text-primary"
          }`}
        >
          All posts
        </button>

        {BLOG_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategorySelect(isActive ? null : category)}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-[9px] px-4.5 py-2.5 text-[13.5px] transition-colors duration-200 ${
                isActive
                  ? "fw-btn font-bold"
                  : "border border-card-br bg-card font-semibold text-text-secondary hover:text-text-primary"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="relative shrink-0">
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-muted"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="w-full rounded-[9px] border border-raise-br bg-raise py-2.5 pr-4 pl-10 text-[13.5px] text-text-primary placeholder:text-text-muted focus:border-accent-400 focus:outline-none lg:w-64"
        />
      </div>
    </div>
  );
}
