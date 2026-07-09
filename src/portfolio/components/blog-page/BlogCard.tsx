import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../types";

interface BlogCardProps {
  readonly post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl bg-[#0a0a0a] border border-border-subtle overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-900/10">
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-900 border-b border-border-subtle">
        <img
          src={post.imagePlaceholder}
          alt={`Cover image for ${post.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-surface-950/10 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col p-6 sm:p-8 flex-1">
        {/* Meta Line */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 text-text-muted">
          <span className="text-primary-400">{post.category}</span>
          <span>&bull;</span>
          <span>{post.date}</span>
          <span>&bull;</span>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 leading-snug group-hover:text-primary-400 transition-colors duration-300">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-sm sm:text-base text-text-secondary line-clamp-3 mb-8 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Action Link */}
        <Link 
          to={post.href}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-primary-400 group-hover:text-primary-300 transition-colors duration-200 mt-auto"
        >
          Read Article
          <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </article>
  );
}
