import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly onChange: (page: number) => void;
  readonly className?: string;
}

/**
 * Previous/next pager for the list pages.
 *
 * Owns the "only render when there is more than one page" check, so callers
 * do not each repeat the guard — one of them had it wrong and showed a
 * disabled pager on single-page results.
 */
export default function Pagination({
  page,
  totalPages,
  onChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-between gap-4 mt-6 ${className}`}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        icon={<ChevronLeft className="h-4 w-4" />}
        iconPosition="left"
      >
        Previous
      </Button>

      <p aria-live="polite" className="text-sm text-text-secondary">
        Page <span className="font-semibold tabular-nums">{page}</span> of{" "}
        <span className="font-semibold tabular-nums">{totalPages}</span>
      </p>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        icon={<ChevronRight className="h-4 w-4" />}
      >
        Next
      </Button>
    </nav>
  );
}
