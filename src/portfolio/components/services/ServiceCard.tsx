import { ArrowRight } from "lucide-react";
import type { Service } from "../../types";

interface ServiceCardProps {
  readonly service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <article className="group relative flex flex-col rounded-2xl bg-surface-900/60 border border-border-subtle p-8 transition-all duration-300 hover:border-primary-600/30 hover:bg-surface-800/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-600/5">
      {/* Icon container */}
      <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-primary-600/20 to-accent-500/10 border border-primary-600/20 group-hover:from-primary-600/30 group-hover:to-accent-500/20 transition-all duration-300">
        <Icon size={24} className="text-primary-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-text-primary mb-3">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">
        {service.description}
      </p>

      {/* Learn More link */}
      <a
        href={service.href}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted group-hover:text-primary-400 transition-colors duration-200"
      >
        Learn More
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </a>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-primary-600/40 group-hover:w-20 group-hover:bg-primary-500 transition-all duration-300" />
    </article>
  );
}
