interface PageHeaderProps {
  readonly title: string;
  readonly description?: React.ReactNode;
  /** Right-aligned controls — usually the primary "New …" button. */
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

/**
 * The heading block every admin page opens with.
 *
 * The title is the CMS's one piece of display type: Fraunces at a size that
 * actually anchors the page, against Inter everywhere else. Previously each
 * page hand-rolled this as `text-2xl font-bold`, which left the screens
 * without a focal point and drifted between pages.
 */
export default function PageHeader({
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8 ${className}`}
    >
      <div className="min-w-0">
        <h1 className="admin-display text-[2rem] md:text-[2.5rem] leading-[1.05] text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
