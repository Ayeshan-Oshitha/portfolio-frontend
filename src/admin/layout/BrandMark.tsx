interface BrandMarkProps {
  readonly size?: "sm" | "lg";
  /** Hides the wordmark, leaving just the tile. */
  readonly iconOnly?: boolean;
  readonly className?: string;
}

const TILE_SIZE = {
  sm: "h-9 w-9 rounded-xl",
  lg: "h-12 w-12 rounded-2xl",
} as const;

const GLYPH_SIZE = {
  sm: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

const WORDMARK_SIZE = {
  sm: "text-[15px]",
  lg: "text-lg",
} as const;

/**
 * The CMS brand lockup.
 *
 * The glyph is the FrostWoodTech mark taken from `public/favicon.svg`,
 * redrawn as a single `currentColor` path — the source file carries the old
 * purple brand baked in as literal fills, so it could not be recoloured.
 * The sidebar and the sign-in screen share this rather than each drawing
 * their own; the sidebar previously showed a hardcoded letter "P", left over
 * from an earlier project name.
 */
export default function BrandMark({
  size = "sm",
  iconOnly = false,
  className = "",
}: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center bg-primary-600 text-white shadow-btn ${TILE_SIZE[size]}`}
      >
        <svg
          viewBox="0 0 48 46"
          fill="none"
          aria-hidden="true"
          className={GLYPH_SIZE[size]}
        >
          <path
            fill="currentColor"
            d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
          />
        </svg>
      </span>

      {!iconOnly && (
        <div className="min-w-0 leading-tight">
          <p
            className={`admin-display text-text-primary ${WORDMARK_SIZE[size]}`}
          >
            FrostWoodTech
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-600">
            CMS
          </p>
        </div>
      )}
    </div>
  );
}
