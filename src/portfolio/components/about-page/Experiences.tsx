import { EXPERIENCES_HEADER, EXPERIENCES_DATA } from "@/portfolio/data/about-page";
import SectionHeader from "@/portfolio/components/ui/SectionHeader";

export default function Experiences() {
  return (
    <section className="relative py-24 sm:py-32 bg-surface-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader {...EXPERIENCES_HEADER} />

        <div className="mt-16 space-y-12 border-l-2 border-border-subtle pl-6 sm:pl-10 relative">
          {EXPERIENCES_DATA.map((exp, index) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-surface-950 border-2 border-primary-500 group-hover:bg-primary-500 transition-colors duration-300 shadow-sm shadow-primary-500/20" />
              
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <h3 className="text-xl font-bold text-text-primary group-hover:text-primary-400 transition-colors duration-300">
                  {exp.role}
                </h3>
                <span className="text-sm font-semibold tracking-wider text-text-muted mt-1 sm:mt-0 uppercase">
                  {exp.period}
                </span>
              </div>
              <p className="text-lg font-medium text-primary-300 mb-4">
                {exp.company}
              </p>
              <p className="text-text-secondary leading-relaxed max-w-2xl">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
