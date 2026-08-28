import WorkCard from "./WorkCard";
import type { Project } from "@/client/types";

interface WorkGridProps {
  readonly projects: readonly Project[];
  /**
   * Promotes the first project to a full-width lead card. Only passed when
   * nothing is filtered, so we never call an arbitrary search result
   * "featured".
   */
  readonly showFeatured?: boolean;
}

export default function WorkGrid({
  projects,
  showFeatured = false,
}: WorkGridProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-[20px] border border-card-br bg-card py-20 text-center shadow-card">
        <p className="font-display text-[22px] font-medium text-text-primary">
          No projects match that.
        </p>
        <p className="mt-2 text-[15px] text-text-secondary">
          Try a different search or clear the filters.
        </p>
      </div>
    );
  }

  const [lead, ...rest] = projects;
  const featured = showFeatured ? lead : null;
  const grid = showFeatured ? rest : projects;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {featured && <WorkCard project={featured} featured />}
      {grid.map((project) => (
        <WorkCard key={project.id} project={project} />
      ))}
    </div>
  );
}
