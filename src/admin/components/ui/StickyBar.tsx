interface StickyBarProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * Pinned action bar at the bottom of the long editor forms, so Save stays
 * reachable without scrolling to the end of a 500-line form.
 *
 * The negative margins cancel the main region's padding so the bar spans the
 * full content width; they must stay in step with `AdminLayout`'s `<main>`
 * padding.
 */
export default function StickyBar({
  children,
  className = "",
}: StickyBarProps) {
  return (
    <div
      className={`sticky bottom-0 z-20 mt-8 -mx-5 md:-mx-10 px-5 md:px-10 py-4 bg-surface-950/90 backdrop-blur-md border-t border-border-subtle ${className}`}
    >
      {children}
    </div>
  );
}
