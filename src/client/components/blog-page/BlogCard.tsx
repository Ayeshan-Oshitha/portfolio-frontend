import { Link } from "react-router-dom";
import Badge from "@/client/components/ui/Badge";
import type { BlogPost } from "@/client/types";

interface BlogCardProps {
  readonly post: BlogPost;
  /** The lead post spans the row and lays out side by side. */
  readonly featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      to={post.href}
      className={`group flex overflow-hidden rounded-[20px] border border-card-br bg-card shadow-card transition-colors duration-300 hover:border-hair-strong ${
        featured
          ? "flex-col md:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-5"
          : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden fw-media ${
          featured
            ? "min-h-55 border-b border-hair lg:col-span-2 lg:min-h-full lg:border-r lg:border-b-0"
            : "h-45 border-b border-hair"
        }`}
      >
        {post.imagePlaceholder ? (
          <img
            src={post.imagePlaceholder}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <svg
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full text-media-fg"
            aria-hidden="true"
          >
            <g
              opacity="0.5"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.3"
            >
              <rect x="60" y="25" width="280" height="150" rx="12" />
              <path d="M60 65h280" />
              <path d="M60 150 Q160 105 250 135 T400 95" />
            </g>
          </svg>
        )}
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 p-6 ${featured ? "lg:col-span-3 lg:justify-center lg:p-11" : ""}`}
      >
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-text-muted">
          <Badge>{post.category}</Badge>
          <span>{post.date}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>

        <h3
          className={`font-display font-medium tracking-[-0.018em] text-text-primary ${
            featured
              ? "text-[26px] sm:text-[34px]"
              : "text-[21px] leading-[1.24]"
          }`}
        >
          {post.title}
        </h3>

        <p
          className={`leading-[1.65] text-text-secondary ${
            featured ? "text-base" : "line-clamp-3 text-sm"
          }`}
        >
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
