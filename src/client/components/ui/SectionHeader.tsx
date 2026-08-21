import type { SectionHeaderConfig } from "@/client/types";

interface SectionHeaderProps extends SectionHeaderConfig {
  readonly className?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`text-center max-w-3xl mx-auto mb-16 ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary-600/10 text-primary-400 border border-primary-600/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
          {badge}
        </span>
      )}

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary whitespace-pre-line leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-6 text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
