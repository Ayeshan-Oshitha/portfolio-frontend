import { useParams, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useArticle } from "@/client/hooks/useArticle";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { toErrorMessage } from "@/client/services/ApiError";
import useTheme from "@/client/context/useTheme";
import { BRAND } from "@/client/data/navigation";
import Spinner from "@/client/components/ui/Spinner";
import Button from "@/client/components/ui/Button";
import Badge from "@/client/components/ui/Badge";
import PanelCTA from "@/client/components/ui/PanelCTA";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError, error } = useArticle(slug);
  const { theme } = useTheme();

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
        <p className="mb-6 text-danger-400">
          {error ? toErrorMessage(error) : "We couldn't find that article."}
        </p>
        <Button
          href="/blog"
          variant="outline"
          icon={<ArrowLeft size={16} />}
          iconPosition="left"
        >
          Back to blog
        </Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-190 w-300 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-137 -right-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 pt-8 pb-26 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 text-[13.5px] text-text-muted"
        >
          <Link to="/blog" className="hover:text-text-primary">
            Blog
          </Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="line-clamp-1 font-semibold text-text-primary">
            {post.title}
          </span>
        </nav>

        {/* Article header */}
        <header className="mx-auto mt-11 max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] text-text-muted">
            <Badge>{post.category}</Badge>
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="mt-6.5 font-display text-[34px] leading-[1.09] font-medium tracking-[-0.018em] text-text-primary sm:text-[46px] lg:text-[58px]">
            {post.title}
          </h1>

          <p className="mt-6 text-lg leading-[1.6] text-text-secondary sm:text-xl">
            {post.excerpt}
          </p>

          <div className="mt-8.5 flex items-center justify-center gap-3 border-t border-hair pt-7">
            <span
              aria-hidden="true"
              className="flex h-10.5 w-10.5 items-center justify-center rounded-full fw-btn text-sm font-bold"
            >
              FW
            </span>
            <span className="text-left">
              <span className="block text-[14.5px] font-bold text-text-primary">
                {BRAND.name}
              </span>
              <span className="mt-0.5 block text-[13px] text-text-muted">
                {BRAND.tagline}
              </span>
            </span>
          </div>
        </header>

        {/* Cover */}
        {post.imagePlaceholder && (
          <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[22px] border border-hair fw-media shadow-card">
            <img
              src={post.imagePlaceholder}
              alt={`Cover image for ${post.title}`}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Body */}
        <article className="mx-auto mt-16 max-w-3xl">
          {post.contentMarkdown ? (
            <div data-color-mode={theme} className="fw-prose">
              <MDEditor.Markdown
                source={post.contentMarkdown}
                style={{ backgroundColor: "transparent", color: "inherit" }}
              />
            </div>
          ) : (
            <p className="text-[17.5px] leading-[1.78] text-text-secondary">
              {post.excerpt}
            </p>
          )}

        </article>

        <div className="mt-20">
          <PanelCTA
            title="Building something like this?"
            description="Tell us what you're working on. You'll get a scoped proposal and a fixed price within three working days."
            primaryLabel="Start a project"
            primaryHref="/contact"
            secondaryLabel="More posts"
            secondaryHref="/blog"
          />
        </div>
      </div>
    </div>
  );
}
