import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useProjects } from "@/client/hooks/useProjects";
import { toErrorMessage } from "@/client/services/ApiError";
import WorkHeader from "@/client/components/work-page/WorkHeader";
import WorkFilters from "@/client/components/work-page/WorkFilters";
import WorkGrid from "@/client/components/work-page/WorkGrid";
import PanelCTA from "@/client/components/ui/PanelCTA";
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
      .sort((a, b) =>
        sortOrder === "newest" ? b.year - a.year : a.year - b.year,
      );
  }, [projects, debouncedSearchQuery, selectedCategories, sortOrder]);

  const isFiltered =
    debouncedSearchQuery.length > 0 || selectedCategories.length > 0;

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-190 w-275 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -left-80 h-195 w-195 fw-amb-2"
      />

      <div className="relative z-2 mx-auto flex max-w-7xl flex-col gap-13 px-4 pt-23 pb-26 sm:px-6 lg:px-8">
        <WorkHeader />

        <div className="flex flex-col gap-5">
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

          {!isLoading && !isError && (
            <WorkGrid projects={filteredProjects} showFeatured={!isFiltered} />
          )}
        </div>

        <PanelCTA
          title="Yours could be next."
          description="Tell us what you're building. You'll get a scoped proposal and a fixed price within three working days."
          primaryLabel="Start a project"
          primaryHref="/contact"
        />
      </div>
    </div>
  );
}
