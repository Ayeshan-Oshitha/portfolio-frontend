import type { BlogPost } from "../../types";
import BlogCard from "./BlogCard";

interface BlogGridProps {
  readonly posts: readonly BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-lg">
          No articles found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
