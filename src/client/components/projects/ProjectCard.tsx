import { ArrowRight, Calendar } from "lucide-react";
import Badge from "@/client/components/ui/Badge";
import Button from "@/client/components/ui/Button";
import type { Project } from "@/client/types";

interface ProjectCardProps {
  readonly project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formattedIndex = String(project.index).padStart(2, "0");

  return (
    <article className="group relative rounded-2xl bg-surface-900/60 border border-border-subtle overflow-hidden transition-all duration-300 hover:border-primary-600/20 hover:shadow-2xl hover:shadow-primary-600/5">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image preview */}
        <div className="relative aspect-video lg:aspect-auto overflow-hidden bg-surface-800">
          <img
            src={project.imagePlaceholder}
            alt={`${project.title} project screenshot`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Image overlay gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-surface-900/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface-900/40"
            aria-hidden="true"
          />
        </div>

        {/* Details panel */}
        <div className="flex flex-col justify-center p-8 lg:p-10">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-text-muted" />
              <span className="text-sm font-medium text-text-muted">
                {project.year}
              </span>
            </div>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-800 border border-border-subtle text-xs font-bold text-primary-400">
              {formattedIndex}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
            {project.title}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-text-muted font-medium tracking-wide mb-4">
            {project.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tags + CTA */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-wrap gap-2 flex-1">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              href={project.href}
              variant="primary"
              size="sm"
              icon={<ArrowRight size={16} />}
              className="uppercase tracking-wider text-xs shrink-0"
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
