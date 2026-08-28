import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import type { Testimonial as TestimonialData } from "@/client/types";

interface TestimonialProps {
  readonly testimonial: TestimonialData;
  readonly className?: string;
  readonly onPrev?: () => void;
  readonly onNext?: () => void;
}

function NavButton({
  direction,
  onClick,
}: {
  readonly direction: "prev" | "next";
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous review" : "Next review"}
      className="mt-1 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-card-br bg-card text-text-secondary transition-colors duration-200 hover:text-text-primary"
    >
      {direction === "prev" ? (
        <ArrowLeft size={16} aria-hidden="true" />
      ) : (
        <ArrowRight size={16} aria-hidden="true" />
      )}
    </button>
  );
}

export default function Testimonial({
  testimonial,
  className = "",
  onPrev,
  onNext,
}: TestimonialProps) {
  const showNav = Boolean(onPrev && onNext);
  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      <figure className="mx-auto max-w-4xl text-center">
        {typeof testimonial.rating === "number" && (
          <div
            className="mb-5 flex justify-center gap-0.5 text-star"
            aria-label={`${testimonial.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={17}
                aria-hidden="true"
                className={
                  index < testimonial.rating!
                    ? "fill-current"
                    : "text-border-default"
                }
              />
            ))}
          </div>
        )}

        <svg
          width="34"
          height="28"
          viewBox="0 0 34 28"
          fill="none"
          aria-hidden="true"
          className="mx-auto block text-quote"
        >
          <path
            d="M13.6 0C6.1 3.4 1.4 10 1.4 17.6c0 5.9 3.5 10 8.6 10 4.4 0 7.7-3.2 7.7-7.4 0-4-2.9-7-6.7-7-.7 0-1.5.1-1.8.2.6-3.9 4.3-8 8.9-10.2L13.6 0zm18 0C24.1 3.4 19.4 10 19.4 17.6c0 5.9 3.5 10 8.6 10 4.4 0 7.7-3.2 7.7-7.4 0-4-2.9-7-6.7-7-.7 0-1.5.1-1.8.2.6-3.9 4.3-8 8.9-10.2L31.6 0z"
            fill="currentColor"
            transform="translate(-1.4 0)"
          />
        </svg>

        <div className="mt-7 flex items-start justify-center gap-4 sm:gap-6">
          {showNav && <NavButton direction="prev" onClick={onPrev!} />}
          <blockquote className="font-display text-[24px] leading-[1.4] font-normal tracking-[-0.018em] text-text-primary sm:text-[34px]">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          {showNav && <NavButton direction="next" onClick={onNext!} />}
        </div>

        <figcaption className="mt-8.5 flex items-center justify-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex h-11.5 w-11.5 items-center justify-center rounded-full fw-btn text-[15px] font-bold"
          >
            {testimonial.initials}
          </span>
          <span className="text-left">
            <span className="block text-[15px] font-bold text-text-primary">
              {testimonial.name}
            </span>
            <span className="mt-0.5 block text-[13.5px] text-text-muted">
              {testimonial.role}
            </span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
