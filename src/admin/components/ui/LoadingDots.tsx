interface LoadingDotsProps {
  readonly className?: string;
  readonly label?: string;
}

/** Three bouncing dots — an inline "still loading" cue for small async fields. */
export default function LoadingDots({
  className = "",
  label = "Loading",
}: LoadingDotsProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
