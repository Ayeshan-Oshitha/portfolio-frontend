import { VALUES_HEADER, VALUES_DATA } from "../../data/about-page";
import SectionHeader from "../ui/SectionHeader";

export default function CoreValues() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader {...VALUES_HEADER} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-16">
          {VALUES_DATA.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.id}
                className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-surface-900/60 border border-border-subtle hover:bg-surface-800/80 transition-colors duration-300"
              >
                <div className="flex items-center justify-center w-14 h-14 shrink-0 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-600/20">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
