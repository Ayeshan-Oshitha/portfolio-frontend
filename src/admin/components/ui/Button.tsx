import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import type { AdminButtonVariant, AdminButtonSize } from "./types";

interface ButtonBaseProps {
  readonly variant?: AdminButtonVariant;
  readonly size?: AdminButtonSize;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: "left" | "right";
  /** Stretches to the container — the default for form submit buttons. */
  readonly fullWidth?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps {
  readonly href?: never;
  readonly onClick?: () => void;
  readonly type?: "button" | "submit" | "reset";
  readonly disabled?: boolean;
  /** Shows a spinner and blocks interaction while an action is in flight. */
  readonly loading?: boolean;
}

interface ButtonAsLink extends ButtonBaseProps {
  readonly href: string;
  readonly onClick?: never;
  readonly type?: never;
  readonly disabled?: never;
  readonly loading?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_CLASSES: Record<AdminButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white shadow-btn hover:bg-primary-700 active:bg-primary-800",
  secondary:
    "bg-surface-800 text-text-primary border border-border-default hover:bg-surface-700 hover:border-border-strong",
  outline:
    "bg-surface-900 text-text-primary border border-border-default hover:bg-surface-800 hover:border-border-strong",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-800",
  subtle:
    "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100",
  danger: "bg-danger-500 text-white shadow-btn hover:bg-danger-400",
};

/**
 * Fixed heights rather than vertical padding: the filter toolbars lay buttons
 * and fields out side by side, and matching `h-*` values are what keep that
 * row on a single baseline. Radius scales with size for the same reason —
 * a `lg` button with `sm` corners reads unfinished.
 */
const SIZE_CLASSES: Record<AdminButtonSize, string> = {
  xs: "h-8 px-2.5 text-xs gap-1.5 rounded-md",
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-lg",
  lg: "h-12 px-7 text-base gap-2.5 rounded-xl",
};

/**
 * The admin panel's button. Mirrors the client `Button` API so call sites are
 * interchangeable, but stays flat — no coloured shadows or glow — to suit the
 * light admin theme.
 */
export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  iconPosition = "right",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold tracking-tight select-none " +
    "transition-[background-color,border-color,box-shadow,transform] duration-150 " +
    "motion-safe:active:translate-y-px cursor-pointer " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950";

  const { disabled = false, loading = false } = props as ButtonAsButton;
  const isDisabled = disabled || loading;

  const stateClasses = isDisabled ? "opacity-60 pointer-events-none" : "";
  const widthClasses = fullWidth ? "w-full" : "";

  const classes = `${baseClasses} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${widthClasses} ${stateClasses} ${className}`;

  const content = (
    <>
      {loading && <Spinner className="h-4 w-4 shrink-0" />}
      {!loading && icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    if (props.href.startsWith("http")) {
      return (
        <a
          href={props.href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link to={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { onClick, type = "button" } = props as ButtonAsButton;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  );
}
