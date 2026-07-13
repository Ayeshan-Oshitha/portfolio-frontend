import { Search, ChevronDown } from "lucide-react";
import { BLOG_CATEGORIES } from "@/portfolio/data/blog-page";

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
          placeholder="Search articles..."
          className="w-full pl-11 pr-4 py-3.5 bg-surface-950 border border-border-default rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-200"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
          Categories
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
              selectedCategory === null
                ? "bg-primary-600/20 text-primary-400 border-primary-500/40"
                : "bg-surface-900 text-text-secondary border-border-default hover:text-text-primary hover:border-text-muted"
            }`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
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
