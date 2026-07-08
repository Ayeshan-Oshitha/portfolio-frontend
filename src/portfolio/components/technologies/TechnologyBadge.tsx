import type { Technology } from "../../types";

interface TechnologyBadgeProps {
  readonly technology: Technology;
}

export default function TechnologyBadge({ technology }: TechnologyBadgeProps) {
  const Icon = technology.icon;

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-surface-900/60 border border-border-subtle text-sm font-medium text-text-secondary transition-all duration-200 hover:border-primary-600/30 hover:text-text-primary hover:bg-surface-800/80 cursor-default">
      <Icon size={16} className="text-primary-400 shrink-0" />
      <span>{technology.name}</span>
    </div>
  );
}
