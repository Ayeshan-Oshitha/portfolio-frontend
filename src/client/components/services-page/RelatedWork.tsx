import { Link } from "react-router-dom";
import { ALL_PROJECTS } from "@/client/data/projects";

export default function RelatedWork() {
  // Take the first 3 projects for the Related Work section
  const relatedProjects = ALL_PROJECTS.slice(0, 3);

  return (
    <section className="mb-32">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          Related Work
        </h2>
        <Link
          to="/work"
          className="text-xs font-bold tracking-widest uppercase text-text-secondary hover:text-primary-400 transition-colors duration-200"
        >
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProjects.map((project) => (
          <Link
            key={project.id}
            to={project.href}
            className="group flex flex-col bg-[#0a0a0a] border border-border-subtle rounded-xl overflow-hidden hover:border-primary-500/30 transition-colors duration-300"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-900 border-b border-border-subtle">
              <img
                src={project.imagePlaceholder}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-surface-950/10 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary-400 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-sm text-text-secondary">{project.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
