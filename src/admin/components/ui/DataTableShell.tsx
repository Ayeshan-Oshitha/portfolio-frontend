import type { LucideIcon } from "lucide-react";
import Alert from "./Alert";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

interface DataTableShellProps {
  readonly isLoading: boolean;
  /**
   * A background refetch is in flight — e.g. a filter changed and
   * `placeholderData: (previous) => previous` is keeping the old rows around
   * as `data` while the new page loads. Treated the same as `isLoading`: the
   * stale rows are replaced with the spinner rather than left on screen, so
   * there is exactly one loading state, not old data plus a second spinner
   * layered on top of it.
   */
  readonly isFetching?: boolean;
  readonly isEmpty: boolean;
  readonly error?: string | null;
  readonly emptyTitle: string;
  readonly emptyDescription?: string;
  readonly emptyIcon?: LucideIcon;
  readonly emptyAction?: React.ReactNode;
  readonly children: React.ReactNode;
}

/**
 * Resolves the loading / error / empty / loaded states around a list.
 *
 * Every CRUD page was repeating the same nested ternary, and they had drifted:
 * some showed the error above the spinner, some replaced the table with it,
 * and the empty copy was inconsistent. Centralising the decision means the
 * states are the same everywhere and a page only supplies the table itself.
 *
 * The error renders above the table rather than instead of it, so a failed
 * refetch does not throw away rows the user is still reading.
 */
export default function DataTableShell({
  isLoading,
  isFetching,
  isEmpty,
  error,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  children,
}: DataTableShellProps) {
  return (
    <>
      {error && (
        <div className="p-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {isLoading || isFetching ? (
        <LoadingState />
      ) : isEmpty ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      ) : (
        children
      )}
    </>
  );
}
