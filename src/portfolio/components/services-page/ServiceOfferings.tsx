import { SERVICES_DATA } from "@/portfolio/data/services-page";

export default function ServiceOfferings() {
  return (
    <section className="mb-32 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {SERVICES_DATA.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="group flex flex-col p-8 rounded-2xl bg-surface-950 border border-border-subtle hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-surface-900 border border-border-default text-primary-400 group-hover:bg-primary-600/10 group-hover:text-primary-300 transition-colors duration-300 mb-6">
                <Icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary-400 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-1">
                {service.description}
              </p>

              <ul className="space-y-3 border-t border-border-subtle pt-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium text-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
