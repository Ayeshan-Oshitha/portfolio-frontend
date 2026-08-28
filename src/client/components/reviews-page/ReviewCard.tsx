import { Star } from "lucide-react";
import type { ApiReview } from "@/client/types";
import { countryCodeToFlag } from "@/client/lib/countryFlag";

interface ReviewCardProps {
  readonly review: ApiReview;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "?";
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[20px] border border-card-br bg-card p-7.5 shadow-card">
      <div
        className="flex gap-0.5 text-star"
        aria-label={`${review.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={15}
            aria-hidden="true"
            className={
              index < review.rating ? "fill-current" : "text-border-default"
            }
          />
        ))}
      </div>

      <p className="text-[15.5px] leading-[1.7] text-text-secondary">
        &ldquo;{review.reviewText}&rdquo;
      </p>

      <div className="mt-auto flex items-center gap-3 border-t border-hair pt-4.5">
        <span
          aria-hidden="true"
          className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full fw-icon-bg border border-hair text-[12.5px] font-bold text-icon-fg"
        >
          {initialsOf(review.name)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
            <span className="truncate">{review.name}</span>
            <span aria-hidden="true">
              {countryCodeToFlag(review.countryCode)}
            </span>
          </div>
          {review.position && (
            <div className="mt-0.5 truncate text-[12.5px] text-text-muted">
              {review.position}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
