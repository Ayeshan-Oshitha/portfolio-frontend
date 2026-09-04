interface SpinnerProps {
  readonly className?: string;
  readonly label?: string;
}

/**
 * The admin panel's spinner. Identical in behaviour to the client `Spinner`,
 * but owned by the admin so the CMS has no runtime dependency on the
 * marketing design system — see the note in `Badge.tsx` for why that
 * separation matters.
 */
export default function Spinner({
  className = "h-5 w-5",
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
    />
  );
}
