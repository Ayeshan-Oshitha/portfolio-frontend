import BlogCard from "./BlogCard";
import type { BlogPost } from "@/client/types";

interface BlogGridProps {
  readonly posts: readonly BlogPost[];
  /** Promotes the newest post to a lead card when nothing is filtered. */
  readonly showFeatured?: boolean;
}

export default function BlogGrid({
  posts,
  showFeatured = false,
}: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-[20px] border border-card-br bg-card py-20 text-center shadow-card">
        <p className="font-display text-[22px] font-medium text-text-primary">
          Nothing here yet.
        </p>
        <p className="mt-2 text-[15px] text-text-secondary">
          Try a different search or clear the filters.
        </p>
      </div>
    );
  }

  const [lead, ...rest] = posts;
  const featured = showFeatured ? lead : null;
  const grid = showFeatured ? rest : posts;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {featured && <BlogCard post={featured} featured />}
      {grid.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
