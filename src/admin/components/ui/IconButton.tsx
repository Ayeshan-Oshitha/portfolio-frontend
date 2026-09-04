interface IconButtonProps {
  readonly icon: React.ReactNode;
  /**
   * Describes the action for screen readers and the tooltip. Required —
   * an icon-only control with no label is unusable without sight.
   */
  readonly label: string;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly type?: "button" | "submit";
  readonly tone?: "default" | "danger";
  readonly className?: string;
}

const TONE_CLASSES = {
  default: "text-text-muted hover:text-text-primary hover:bg-surface-800",
  danger: "text-text-muted hover:text-danger-500 hover:bg-danger-50",
} as const;

/**
 * Compact icon-only action, used for the row controls in list tables.
 *
 * Row actions used to be text buttons ("Edit", "Delete", "Publish"), which
 * cost a lot of horizontal room in every row and pushed the useful columns
 * off narrow screens. The label survives as the accessible name and the
 * native tooltip.
 */
export default function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  type = "button",
  tone = "default",
  className = "",
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
    </button>
  );
}
