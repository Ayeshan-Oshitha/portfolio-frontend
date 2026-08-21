import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ALL_PROJECTS } from "../data/projects";
import WorkHeader from "../components/work-page/WorkHeader";
import WorkFilters from "../components/work-page/WorkFilters";
import WorkGrid from "../components/work-page/WorkGrid";

export default function WorkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      // 1. Search Filter
      const query = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.categories.some((c) => c.toLowerCase().includes(query)) ||
        project.technologies.some((t) => t.toLowerCase().includes(query));

      // 2. Category Filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((c) => project.categories.includes(c));

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      // 3. Sorting (Internal year field is used for sorting)
      if (sortOrder === "newest") {
        return b.year - a.year;
      }
      return a.year - b.year;
    });
  }, [debouncedSearchQuery, selectedCategories, sortOrder]);

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

        <WorkGrid projects={filteredProjects} />
      </div>
    </div>
  );
}
