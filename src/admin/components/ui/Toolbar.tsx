interface ToolbarProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * The filter row above a list table.
 *
 * `items-end` aligns the controls on their bottom edge, which is what lines
 * fields up with each other given their labels sit above them. Fields in
 * here should use `fieldSize="sm"` so their height matches a `sm` button.
 */
export default function Toolbar({ children, className = "" }: ToolbarProps) {
  return (
    <div className={`flex flex-wrap items-end gap-3 mb-6 ${className}`}>
      {children}
    </div>
  );
}
