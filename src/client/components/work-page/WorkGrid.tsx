import type { Project } from "@/client/types";
import WorkCard from "./WorkCard";

interface WorkGridProps {
  readonly projects: readonly Project[];
}

export default function WorkGrid({ projects }: WorkGridProps) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-lg">
          No projects found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {projects.map((project) => (
        <WorkCard key={project.id} project={project} />
      ))}
    </div>
  );
}
