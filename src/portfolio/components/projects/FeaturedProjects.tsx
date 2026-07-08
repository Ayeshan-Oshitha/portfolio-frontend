import { ArrowRight } from "lucide-react";
import { PROJECTS_HEADER, FEATURED_PROJECTS } from "../../data/projects";
import SectionHeader from "../ui/SectionHeader";
import ProjectCard from "./ProjectCard";
import Button from "../ui/Button";

export default function FeaturedProjects() {
  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader {...PROJECTS_HEADER} />

        <div className="flex flex-col gap-8">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="flex justify-center mt-14">
          <Button
            href="/projects"
            variant="outline"
            size="lg"
            icon={<ArrowRight size={18} />}
            className="uppercase tracking-wider text-xs"
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
