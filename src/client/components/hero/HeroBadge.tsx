interface HeroBadgeProps {
  readonly text: string;
}

export default function HeroBadge({ text }: HeroBadgeProps) {
  return (
    <div className="animate-fade-in-up">
      <span className="inline-flex items-center gap-2 px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full bg-surface-800/60 text-text-secondary border border-border-subtle backdrop-blur-sm">
        {text}
      </span>
    </div>
  );
}
