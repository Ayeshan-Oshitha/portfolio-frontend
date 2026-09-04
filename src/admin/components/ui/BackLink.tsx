import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackLinkProps {
  readonly to: string;
  readonly children: React.ReactNode;
}

/** "Back to …" link above an editor page's heading. */
export default function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 mb-6 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform duration-150 motion-safe:group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}
