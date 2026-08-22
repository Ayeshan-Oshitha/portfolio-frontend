import { useParams, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useArticle } from "@/client/hooks/useArticle";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { toErrorMessage } from "@/client/services/ApiError";
import Spinner from "@/client/components/ui/Spinner";
import Button from "@/client/components/ui/Button";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError, error } = useArticle(slug);

  useDocumentTitle(post ? post.title : "Loading Article…");

  if (isLoading) {
    return (
      <div className="flex justify-center pt-48 pb-24 text-text-muted">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="pt-48 pb-24 text-center">
        <p className="text-danger-400 mb-6">
          {error ? toErrorMessage(error) : "We couldn't find that article."}
        </p>
        <Button href="/blog" variant="outline" icon={<ArrowLeft size={16} />} iconPosition="left">
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-24 sm:pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-text-muted hover:text-primary-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4 text-text-muted">
          <span className="text-primary-400">{post.category}</span>
          <span>&bull;</span>
          <span>{post.date}</span>
          <span>&bull;</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-tight mb-8">
          {post.title}
        </h1>

        <div className="rounded-2xl overflow-hidden border border-border-subtle mb-10 bg-surface-900">
          <img
            src={post.imagePlaceholder}
            alt={`Cover image for ${post.title}`}
            className="w-full h-auto object-cover"
          />
        </div>

        {post.contentMarkdown ? (
          <div data-color-mode="dark">
            <MDEditor.Markdown
              source={post.contentMarkdown}
              style={{ backgroundColor: "transparent", color: "inherit" }}
            />
          </div>
        ) : (
          <p className="text-text-secondary leading-relaxed">{post.excerpt}</p>
        )}

        {post.mediumUrl && (
          <div className="mt-12 pt-8 border-t border-border-subtle">
            <Button
              href={post.mediumUrl}
              variant="outline"
              icon={<ArrowUpRight size={16} />}
            >
              Read on Medium
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
