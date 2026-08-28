import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useArticles } from "@/client/hooks/useArticles";
import { toErrorMessage } from "@/client/services/ApiError";
import BlogHeader from "@/client/components/blog-page/BlogHeader";
import BlogFilters from "@/client/components/blog-page/BlogFilters";
import BlogGrid from "@/client/components/blog-page/BlogGrid";
import PanelCTA from "@/client/components/ui/PanelCTA";
import Spinner from "@/client/components/ui/Spinner";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts = [], isLoading, isError, error } = useArticles();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const query = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, debouncedSearchQuery, selectedCategory]);

  const isFiltered = debouncedSearchQuery.length > 0 || selectedCategory !== null;

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-190 w-275 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-15 -left-80 h-190 w-190 fw-amb-2"
      />

      <div className="relative z-2 mx-auto flex max-w-7xl flex-col gap-13 px-4 pt-23 pb-26 sm:px-6 lg:px-8">
        <BlogHeader />

        <div className="flex flex-col gap-5">
          <BlogFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
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
            <BlogGrid posts={filteredPosts} showFeatured={!isFiltered} />
          )}
        </div>

        <PanelCTA
          title="One post a month. No newsletter fluff."
          description="We write when we've actually learned something. Or skip the list and just tell us what you're building."
          primaryLabel="Start a project"
          primaryHref="/contact"
        />
      </div>
    </div>
  );
}
