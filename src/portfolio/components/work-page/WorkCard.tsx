import type { Project } from "../../types";

interface WorkCardProps {
  readonly project: Project;
}

export default function WorkCard({ project }: WorkCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl bg-surface-950 border border-border-subtle overflow-hidden hover:border-primary-500/30 transition-colors duration-300">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-900">
        <img
          src={project.imagePlaceholder}
          alt={`Screenshot of ${project.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col p-6 sm:p-8 flex-1">
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          {project.title}
        </h3>
        
        <p className="text-sm text-text-secondary line-clamp-2 mb-6 flex-1">
          {project.tagline}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 bg-surface-900 border border-border-default rounded-full text-[10px] font-bold tracking-wider uppercase text-text-muted"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Technologies - Text Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border-subtle">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-semibold text-text-muted bg-surface-900 px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
