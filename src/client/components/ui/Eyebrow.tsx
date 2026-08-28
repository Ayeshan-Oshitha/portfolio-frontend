interface EyebrowProps {
  readonly children: React.ReactNode;
  /** `center` draws a rule on both sides; `left` only leads with one. */
  readonly align?: "left" | "center";
  readonly tone?: "ice" | "forest";
  readonly className?: string;
}

const TONE_CLASSES: Record<"ice" | "forest", string> = {
  ice: "text-accent-400",
  forest: "text-primary-400",
};

const RULE_CLASSES: Record<"ice" | "forest", string> = {
  ice: "bg-accent-400",
  forest: "bg-primary-400",
};

/**
 * The hairline + letter-spaced label that opens every section in the design.
 * Replaces the old rounded "badge pill" that was pasted across ~10 files.
 */
export default function Eyebrow({
  children,
  align = "left",
  tone = "forest",
  className = "",
}: EyebrowProps) {
  const rule = (
    <span
      aria-hidden="true"
      className={`inline-block w-[22px] h-px ${RULE_CLASSES[tone]}`}
    />
  );

  return (
    <div
      className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.13em] uppercase ${TONE_CLASSES[tone]} ${className}`}
    >
      {rule}
      {children}
      {align === "center" && rule}
    </div>
  );
}
