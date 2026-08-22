import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useProjects } from "@/client/hooks/useProjects";
import { toErrorMessage } from "@/client/services/ApiError";
import WorkHeader from "../components/work-page/WorkHeader";
import WorkFilters from "../components/work-page/WorkFilters";
import WorkGrid from "../components/work-page/WorkGrid";
import Spinner from "@/client/components/ui/Spinner";

export default function WorkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const { data: projects = [], isLoading, isError, error } = useProjects();

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch =
          !query ||
          project.title.toLowerCase().includes(query) ||
          project.categories.some((c) => c.toLowerCase().includes(query)) ||
          project.technologies.some((t) => t.toLowerCase().includes(query));

        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.some((c) => project.categories.includes(c));

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => (sortOrder === "newest" ? b.year - a.year : a.year - b.year));
  }, [projects, debouncedSearchQuery, selectedCategories, sortOrder]);

  return (
    <div className="relative pt-32 pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorkHeader />

        <WorkFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          totalResults={filteredProjects.length}
        />

        {isLoading && (
          <div className="flex justify-center py-24 text-text-muted">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {isError && (
          <div className="py-20 text-center text-danger-400">
            {toErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && <WorkGrid projects={filteredProjects} />}
      </div>
    </div>
  );
}
