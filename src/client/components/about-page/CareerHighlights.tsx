import {
  HIGHLIGHTS_HEADER,
  HIGHLIGHTS_DATA,
} from "@/client/data/about-page";
import SectionHeader from "@/client/components/ui/SectionHeader";

export default function CareerHighlights() {
  return (
    <section className="relative py-24 sm:py-32 bg-surface-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader {...HIGHLIGHTS_HEADER} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-12">
          {HIGHLIGHTS_DATA.map((highlight) => (
            <div
              key={highlight.id}
              className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-surface-950 border border-border-subtle hover:border-primary-500/30 transition-colors duration-300"
            >
              <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-accent-400 mb-2">
                {highlight.metric}
              </span>
              <span className="text-sm sm:text-base font-semibold text-text-secondary text-center">
                {highlight.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
