import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ALL_POSTS } from "../data/blog-page";
import BlogHeader from "../components/blog-page/BlogHeader";
import BlogFilters from "../components/blog-page/BlogFilters";
import BlogGrid from "../components/blog-page/BlogGrid";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return ALL_POSTS.filter((post) => {
      // 1. Search Filter
      const query = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      // 2. Category Filter
      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [debouncedSearchQuery, selectedCategory]);

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

        <BlogGrid posts={filteredPosts} />
      </div>
    </div>
  );
}
