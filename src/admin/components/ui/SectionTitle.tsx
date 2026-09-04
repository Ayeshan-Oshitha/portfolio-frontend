interface SectionTitleProps {
  readonly children: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly className?: string;
}

/** Heading for a section inside a page — one step below `PageHeader`. */
export default function SectionTitle({
  children,
  description,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 className="admin-display text-xl leading-snug text-text-primary">
        {children}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
    </div>
  );
}
