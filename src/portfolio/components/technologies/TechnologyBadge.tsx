import type { Technology } from "../../types";

interface TechnologyBadgeProps {
  readonly technology: Technology;
}

export default function TechnologyBadge({ technology }: TechnologyBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 w-[84px] group cursor-default">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/10 group-hover:border-primary-500/40 group-hover:shadow-xl group-hover:shadow-primary-500/20">
        <img src={technology.icon} alt={`${technology.name} icon`} className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
      </div>
      <span className="text-[13px] font-medium text-text-secondary text-center leading-tight group-hover:text-text-primary transition-colors duration-200">
        {technology.name}
      </span>
    </div>
  );
}
