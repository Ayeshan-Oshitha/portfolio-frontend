import { useParams, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useProject } from "@/client/hooks/useProject";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { toErrorMessage } from "@/client/services/ApiError";
import Spinner from "@/client/components/ui/Spinner";
import Button from "@/client/components/ui/Button";
import Badge from "@/client/components/ui/Badge";

const CASE_STUDY_SECTIONS = [
  { key: "problem", title: "The Problem" },
  { key: "solution", title: "The Solution" },
  { key: "whatWeDelivered", title: "What We Delivered" },
  { key: "proof", title: "Results & Proof" },
] as const;

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError, error } = useProject(slug);

  useDocumentTitle(project ? `${project.title} — Case Study` : "Loading Project…");

  if (isLoading) {
    return (
      <div className="flex justify-center pt-48 pb-24 text-text-muted">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="pt-48 pb-24 text-center">
        <p className="text-danger-400 mb-6">
          {error ? toErrorMessage(error) : "We couldn't find that project."}
        </p>
        <Button href="/work" variant="outline" icon={<ArrowLeft size={16} />} iconPosition="left">
          Back to Work
        </Button>
      </div>
    );
  }

  const gallery = project.images ?? [];

  return (
    <div className="relative pt-32 pb-24 sm:pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-text-muted hover:text-primary-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={14} />
          Back to Work
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {project.categories.map((category) => (
              <Badge key={category} variant="subtle">
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight mb-6">
            {project.title}
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-8 text-sm text-text-muted">
            <span>
              <span className="text-text-muted">Year</span>{" "}
              <span className="text-text-primary font-semibold">{project.year}</span>
            </span>
            {project.clientName && (
              <span>
                <span className="text-text-muted">Client</span>{" "}
                <span className="text-text-primary font-semibold">{project.clientName}</span>
              </span>
            )}
            {project.websiteUrl && (
              <Button
                href={project.websiteUrl}
                variant="outline"
                size="sm"
                icon={<ArrowUpRight size={14} />}
              >
                Visit Live Site
              </Button>
            )}
          </div>
        </div>

        {/* Primary image */}
        {gallery[0] && (
          <div className="rounded-2xl overflow-hidden border border-border-subtle mb-16 bg-surface-900">
            <img
              src={gallery[0].url}
              alt={gallery[0].altText}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Description */}
        <div data-color-mode="dark" className="mb-16">
          <MDEditor.Markdown
            source={project.description}
            style={{ backgroundColor: "transparent", color: "inherit" }}
          />
        </div>

        {/* Case study sections */}
        <div className="grid gap-12 mb-16">
          {CASE_STUDY_SECTIONS.filter(({ key }) => project[key]).map(({ key, title }) => (
            <div key={key}>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{title}</h2>
              <div data-color-mode="dark">
                <MDEditor.Markdown
                  source={project[key] ?? ""}
                  style={{ backgroundColor: "transparent", color: "inherit" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Remaining gallery images */}
        {gallery.length > 1 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {gallery.slice(1).map((image) => (
              <div
                key={image.id}
                className="rounded-2xl overflow-hidden border border-border-subtle bg-surface-900"
              >
                <img src={image.url} alt={image.altText} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="pt-8 border-t border-border-subtle">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted mb-4">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
