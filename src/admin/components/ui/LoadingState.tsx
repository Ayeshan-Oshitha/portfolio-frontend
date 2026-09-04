interface LoadingStateProps {
  /** Roughly how many rows the real table will show. */
  readonly rows?: number;
  readonly label?: string;
}

/**
 * Placeholder rows shown while a list query is in flight.
 *
 * Skeleton rows rather than the centred spinner the pages used before: the
 * table keeps its shape as data arrives, so the page does not collapse to a
 * spinner and then jump back to full height. The varying widths stop the
 * block reading as a solid grey slab.
 */
const WIDTHS = ["w-2/5", "w-1/4", "w-1/3", "w-1/5", "w-2/6"] as const;

export default function LoadingState({
  rows = 5,
  label = "Loading",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="divide-y divide-border-subtle/70"
    >
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-6 px-6 py-4">
          {WIDTHS.map((width, cellIndex) => (
            <span
              key={cellIndex}
              className={`h-3.5 rounded-full bg-surface-800 motion-safe:animate-pulse ${width}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
