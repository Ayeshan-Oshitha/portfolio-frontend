import { Link } from "react-router-dom";

interface TextLinkProps {
  readonly to: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/** Inline navigation link, styled to the admin accent. */
export default function TextLink({
  to,
  children,
  className = "",
}: TextLinkProps) {
  return (
    <Link
      to={to}
      className={`font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 rounded-sm ${className}`}
    >
      {children}
    </Link>
  );
}
