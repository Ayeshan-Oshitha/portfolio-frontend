import Eyebrow from "@/client/components/ui/Eyebrow";
import type { SectionHeaderConfig } from "@/client/types";

interface SectionHeaderProps extends SectionHeaderConfig {
  readonly align?: "left" | "center";
  readonly tone?: "ice" | "forest";
  readonly className?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  tone = "forest",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`${isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} mb-14 ${className}`}
    >
      {badge && (
        <Eyebrow align={align} tone={tone} className="mb-4.5">
          {badge}
        </Eyebrow>
      )}

      <h2 className="font-display text-[38px] leading-[1.08] font-medium tracking-[-0.018em] whitespace-pre-line text-text-primary md:text-[50px]">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-3.5 text-base leading-relaxed text-text-secondary md:text-[16.5px] ${
            isCenter ? "mx-auto max-w-2xl" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
