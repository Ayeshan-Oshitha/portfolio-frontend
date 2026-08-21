import { Link } from "react-router-dom";
import Spinner from "@/client/components/ui/Spinner";
import type { ButtonVariant, ButtonSize } from "@/client/types";

interface ButtonBaseProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: "left" | "right";
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

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow",
  secondary:
    "bg-surface-800 text-text-primary hover:bg-surface-700 border border-border-default",
  outline:
    "bg-transparent text-text-primary border border-border-default hover:bg-surface-800",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-800",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-sm gap-2",
  lg: "px-8 py-4 text-base gap-2.5",
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
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950";

  const { disabled = false, loading = false } = props as ButtonAsButton;
  const isDisabled = disabled || loading;

  const stateClasses = isDisabled ? "opacity-60 pointer-events-none" : "";

  const classes = `${baseClasses} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${stateClasses} ${className}`;

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
