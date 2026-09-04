type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** `none` is for cards whose child owns the edges — a full-bleed table. */
  readonly padding?: CardPadding;
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * The CMS surface primitive.
 *
 * Opaque `surface-900` rather than the translucent fill it used to carry:
 * now that the page underneath is tinted, a semi-transparent white card
 * muddies rather than lifts. Solid white on a tinted page is what reads as
 * elevation.
 */
export default function Card({
  children,
  className = "",
  padding = "lg",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-surface-900 border border-border-subtle shadow-card ${PADDING_CLASSES[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
