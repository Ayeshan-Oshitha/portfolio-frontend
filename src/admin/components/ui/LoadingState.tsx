import Spinner from "./Spinner";

interface LoadingStateProps {
  readonly label?: string;
}

/**
 * Replaces the table content area — first load and every filter-driven
 * refetch alike — with a single centred spinner. Previously this rendered
 * skeleton rows for the first load and a small corner spinner over the
 * still-visible old rows for a refetch; the two states never agreed on how
 * "loading" looked, and the old rows sitting there while a filter change
 * was already in flight read as if the list had not responded. One spinner
 * here means one loading treatment everywhere `DataTableShell` is used.
 */
export default function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex items-center justify-center py-16"
    >
      <Spinner className="h-6 w-6 text-text-muted" />
    </div>
  );
}
