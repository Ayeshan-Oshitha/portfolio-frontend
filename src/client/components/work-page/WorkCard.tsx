import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "@/client/components/ui/Badge";
import type { Project } from "@/client/types";

interface WorkCardProps {
  readonly project: Project;
  /** The lead card spans two columns and lays out side by side. */
  readonly featured?: boolean;
}

export default function WorkCard({ project, featured = false }: WorkCardProps) {
  const cover = (
    <div
      className={`relative overflow-hidden fw-media ${
        featured
          ? "min-h-62 border-b border-hair lg:min-h-full lg:border-r lg:border-b-0"
          : "aspect-16/10 border-b border-hair"
      }`}
    >
      {project.imagePlaceholder ? (
        <img
          src={project.imagePlaceholder}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <svg
          viewBox="0 0 400 250"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full text-media-fg"
          aria-hidden="true"
        >
          <g opacity="0.5" stroke="currentColor" fill="none" strokeWidth="1.2">
            <rect x="60" y="45" width="130" height="130" rx="10" />
            <rect x="130" y="80" width="130" height="130" rx="10" />
            <rect x="200" y="20" width="130" height="130" rx="10" />
          </g>
        </svg>
      )}
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col gap-3 p-7">
      <div className="flex flex-wrap gap-1.5">
        {project.categories.slice(0, featured ? 3 : 2).map((category) => (
          <Badge key={category}>{category}</Badge>
        ))}
      </div>

      <h3
        className={`font-display font-medium tracking-[-0.018em] text-text-primary ${
          featured ? "text-[30px] sm:text-[38px]" : "text-[22px]"
        }`}
      >
        {project.title}
      </h3>

      <p
        className={`leading-[1.65] text-text-secondary ${
          featured ? "text-base" : "line-clamp-3 text-[14.5px]"
        }`}
      >
        {featured ? project.description : project.tagline}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13.5px] font-bold text-accent-400">
        {featured ? "Read the case study" : "View project"}
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </div>
  );

  return (
    <Link
      to={project.href}
      className={`group flex overflow-hidden rounded-[20px] border border-card-br bg-card shadow-card transition-colors duration-300 hover:border-hair-strong ${
        featured
          ? "flex-col md:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-2"
          : "flex-col"
      }`}
    >
      {cover}
      {body}
    </Link>
  );
}
