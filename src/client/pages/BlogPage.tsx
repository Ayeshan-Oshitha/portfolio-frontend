import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useArticles } from "@/client/hooks/useArticles";
import { toErrorMessage } from "@/client/services/ApiError";
import BlogHeader from "../components/blog-page/BlogHeader";
import BlogFilters from "../components/blog-page/BlogFilters";
import BlogGrid from "../components/blog-page/BlogGrid";
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

  return (
    <div className="relative pt-32 pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogHeader />

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

        {!isLoading && !isError && <BlogGrid posts={filteredPosts} />}
      </div>
    </div>
  );
}
