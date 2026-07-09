import { Search, Filter, ChevronDown } from "lucide-react";
import { PROJECT_CATEGORIES } from "../../data/projects";

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
  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-text-muted" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, tags, or technologies..."
          className="w-full pl-11 pr-4 py-3.5 bg-surface-950 border border-border-default rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-200"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600/10 text-primary-400 border border-primary-600/20 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors duration-200 hover:bg-primary-600/20"
          >
            <Filter size={14} />
            Filters
          </button>

          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-surface-900 border border-border-default rounded-lg text-xs font-semibold tracking-wider uppercase text-text-secondary transition-colors duration-200 hover:text-text-primary hover:border-text-muted"
            >
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              <ChevronDown size={14} />
            </button>
            {/* Simple dropdown hover implementation for now */}
            <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-surface-900 border border-border-default rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                className={`w-full text-left px-4 py-2 text-xs font-semibold tracking-wider uppercase hover:bg-surface-800 ${sortOrder === "newest" ? "text-primary-400" : "text-text-secondary"}`}
                onClick={() => onSortChange("newest")}
              >
                Newest First
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-xs font-semibold tracking-wider uppercase hover:bg-surface-800 ${sortOrder === "oldest" ? "text-primary-400" : "text-text-secondary"}`}
                onClick={() => onSortChange("oldest")}
              >
                Oldest First
              </button>
            </div>
          </div>
        </div>

        <span className="text-xs font-semibold tracking-wider uppercase text-text-muted">
          {totalResults} project{totalResults !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
          Categories
        </span>
        <div className="flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                  isActive
                    ? "bg-primary-600/20 text-primary-400 border-primary-500/40"
                    : "bg-surface-900 text-text-secondary border-border-default hover:text-text-primary hover:border-text-muted"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
