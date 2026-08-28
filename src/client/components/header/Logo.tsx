import { Link } from "react-router-dom";
import { BRAND } from "@/client/data/navigation";

interface LogoProps {
  readonly size?: "sm" | "md";
  readonly className?: string;
}

const MARK_SIZE: Record<"sm" | "md", number> = { sm: 26, md: 30 };
const TEXT_CLASSES: Record<"sm" | "md", string> = {
  sm: "text-[18px]",
  md: "text-[20px]",
};

/**
 * The frost mark: a six-point crystal with a forest-green core — the two
 * halves of the name in one glyph.
 */
export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <Link
      to="/"
      className={`flex shrink-0 items-center gap-2.5 ${className}`}
      aria-label={`${BRAND.name} — home`}
    >
      <svg
        width={MARK_SIZE[size]}
        height={MARK_SIZE[size]}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="text-accent-400"
      >
        <path
          d="M16 2.5v27M5 8.2l22 15.6M27 8.2L5 23.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M16 9.5l3.4 2M16 9.5l-3.4 2M16 22.5l3.4-2M16 22.5l-3.4-2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3.4" className="fill-primary-400" />
      </svg>

      <span
        className={`font-display font-medium tracking-[-0.01em] text-text-primary ${TEXT_CLASSES[size]}`}
      >
        {BRAND.name}
      </span>
    </Link>
  );
}
