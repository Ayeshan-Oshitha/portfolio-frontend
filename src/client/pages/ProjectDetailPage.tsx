import { useParams, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { useProject } from "@/client/hooks/useProject";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { toErrorMessage } from "@/client/services/ApiError";
import useTheme from "@/client/context/useTheme";
import Spinner from "@/client/components/ui/Spinner";
import Button from "@/client/components/ui/Button";
import Badge from "@/client/components/ui/Badge";
import Chip from "@/client/components/ui/Chip";
import Eyebrow from "@/client/components/ui/Eyebrow";
import PanelCTA from "@/client/components/ui/PanelCTA";

const CASE_STUDY_SECTIONS = [
  { key: "problem", title: "The challenge" },
  { key: "solution", title: "What we did" },
  { key: "whatWeDelivered", title: "What we delivered" },
  { key: "proof", title: "The outcome" },
] as const;

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError, error } = useProject(slug);
  const { theme } = useTheme();

  useDocumentTitle(
    project ? `${project.title} — Case Study` : "Loading Project…",
  );

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
        <p className="mb-6 text-danger-400">
          {error ? toErrorMessage(error) : "We couldn't find that project."}
        </p>
        <Button
          href="/work"
          variant="outline"
          icon={<ArrowLeft size={16} />}
          iconPosition="left"
        >
          Back to work
        </Button>
      </div>
    );
  }

  const gallery = project.images ?? [];
  const sections = CASE_STUDY_SECTIONS.filter(({ key }) => project[key]);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-200 w-325 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-112 -left-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 pt-8 pb-26 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 text-[13.5px] text-text-muted"
        >
          <Link to="/work" className="hover:text-text-primary">
            Work
          </Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="font-semibold text-text-primary">
            {project.title}
          </span>
        </nav>

        {/* Hero */}
        <div className="mx-auto mt-9 max-w-4xl text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {project.categories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
          </div>

          <h1 className="mt-6 font-display text-[44px] leading-[1.04] font-medium tracking-[-0.018em] text-text-primary sm:text-[60px] lg:text-[76px]">
            {project.title}
          </h1>

          <p className="mx-auto mt-5.5 max-w-2xl text-[18px] leading-[1.6] text-text-secondary sm:text-xl">
            {project.tagline}
          </p>
        </div>

        {/* Hero media */}
        {gallery[0] && (
          <div className="mt-13 overflow-hidden rounded-3xl border border-hair fw-media shadow-card">
            <img
              src={gallery[0].url}
              alt={gallery[0].altText}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Body + sidebar */}
        <div className="mt-19 grid grid-cols-1 gap-15 lg:grid-cols-3">
          <div className="flex flex-col gap-11 lg:col-span-2">
            {project.description && (
              <div data-color-mode={theme} className="fw-prose">
                <MDEditor.Markdown
                  source={project.description}
                  style={{ backgroundColor: "transparent", color: "inherit" }}
                />
              </div>
            )}

            {sections.map(({ key, title }) => (
              <div key={key}>
                <Eyebrow className="mb-4">{title}</Eyebrow>
                <div data-color-mode={theme} className="fw-prose">
                  <MDEditor.Markdown
                    source={project[key] ?? ""}
                    style={{ backgroundColor: "transparent", color: "inherit" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Facts */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-5 rounded-[18px] border border-card-br bg-card p-7 shadow-card">
              {project.clientName && (
                <>
                  <div>
                    <div className="text-[11.5px] font-bold tracking-[0.1em] text-text-muted">
                      CLIENT
                    </div>
                    <div className="mt-1.5 text-[15.5px] font-bold text-text-primary">
                      {project.clientName}
                    </div>
                  </div>
                  <div aria-hidden="true" className="h-px bg-hair" />
                </>
              )}

              <div>
                <div className="text-[11.5px] font-bold tracking-[0.1em] text-text-muted">
                  YEAR
                </div>
                <div className="mt-1.5 text-[15.5px] font-bold tabular-nums text-text-primary">
                  {project.year}
                </div>
              </div>

              {project.technologies.length > 0 && (
                <>
                  <div aria-hidden="true" className="h-px bg-hair" />
                  <div>
                    <div className="text-[11.5px] font-bold tracking-[0.1em] text-text-muted">
                      STACK
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <Chip key={tech} className="px-2.5 py-1 text-[11.5px]">
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {project.websiteUrl && (
                <Button
                  href={project.websiteUrl}
                  className="w-full"
                  icon={<ArrowUpRight size={15} />}
                >
                  Visit the live site
                </Button>
              )}
            </div>
          </aside>
        </div>

        {/* Gallery */}
        {gallery.length > 1 && (
          <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {gallery.slice(1).map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[20px] border border-hair fw-media"
              >
                <img
                  src={image.url}
                  alt={image.altText}
                  loading="lazy"
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-20">
          <PanelCTA
            title="Want something like this?"
            description="Tell us what you're building. You'll get a scoped proposal and a fixed price within three working days."
            primaryLabel="Start a project"
            primaryHref="/contact"
            secondaryLabel="See more work"
            secondaryHref="/work"
          />
        </div>
      </div>
    </div>
  );
}
