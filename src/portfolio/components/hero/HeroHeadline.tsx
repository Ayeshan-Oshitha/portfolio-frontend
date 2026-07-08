interface HeroHeadlineProps {
  readonly primary: string;
  readonly highlight: string;
  readonly suffix: string;
}

export default function HeroHeadline({
  primary,
  highlight,
  suffix,
}: HeroHeadlineProps) {
  return (
    <h1
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] animate-fade-in-up"
      style={{ animationDelay: "150ms" }}
    >
      <span className="text-text-primary">{primary}</span>
      <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
        {highlight}
      </span>
      <span className="text-text-primary">{suffix}</span>
    </h1>
  );
}
