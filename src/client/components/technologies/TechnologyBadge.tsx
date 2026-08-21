import type { Technology } from "@/client/types";

interface TechnologyBadgeProps {
  readonly technology: Technology;
}

export default function TechnologyBadge({ technology }: TechnologyBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 w-24 group cursor-default">
      <div className="flex items-center justify-center w-17 h-17 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/10 group-hover:border-primary-500/40 group-hover:shadow-xl group-hover:shadow-primary-500/20">
        <img
          src={technology.icon}
          alt={`${technology.name} icon`}
          className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
        />
      </div>
      <span className="text-[14px] font-medium text-text-secondary text-center leading-tight group-hover:text-text-primary transition-colors duration-200">
        {technology.name}
      </span>
    </div>
  );
}
