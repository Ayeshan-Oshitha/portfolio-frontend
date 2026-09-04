import type { LucideIcon } from "lucide-react";
import Alert from "./Alert";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

interface DataTableShellProps {
  readonly isLoading: boolean;
  readonly isEmpty: boolean;
  readonly error?: string | null;
  readonly emptyTitle: string;
  readonly emptyDescription?: string;
  readonly emptyIcon?: LucideIcon;
  readonly emptyAction?: React.ReactNode;
  readonly skeletonRows?: number;
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
  isEmpty,
  error,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  skeletonRows,
  children,
}: DataTableShellProps) {
  return (
    <>
      {error && (
        <div className="p-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {isLoading ? (
        <LoadingState rows={skeletonRows} />
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
