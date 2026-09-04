import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  readonly icon?: LucideIcon;
  readonly title: string;
  readonly description?: string;
  /** Usually the same "New …" button as the page header. */
  readonly action?: React.ReactNode;
}

/**
 * Shown when a list has nothing to display.
 *
 * The pages previously used a single muted sentence, which read as though
 * something had failed. Giving the state a title, an icon and — where there
 * is one — the action that resolves it makes an empty table look deliberate.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-800 border border-border-subtle text-text-muted">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}

      <p className="admin-display text-lg text-text-primary">{title}</p>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
