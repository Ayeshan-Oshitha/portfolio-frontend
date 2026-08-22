import { Star, Quote } from "lucide-react";
import type { ApiReview } from "@/client/types";
import { countryCodeToFlag } from "@/client/lib/countryFlag";

interface ReviewCardProps {
  readonly review: ApiReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex flex-col rounded-2xl bg-surface-950 border border-border-subtle p-6 sm:p-8">
      <Quote className="text-primary-500/40 mb-4" size={28} aria-hidden="true" />

      <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={i < review.rating ? "fill-primary-400 text-primary-400" : "text-border-default"}
          />
        ))}
      </div>

      <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-6">
        &ldquo;{review.reviewText}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
        <span className="text-lg" aria-hidden="true">
          {countryCodeToFlag(review.countryCode)}
        </span>
        <div>
          <p className="text-sm font-semibold text-text-primary">{review.name}</p>
          <p className="text-xs text-text-muted">
            {[review.position, review.country].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </article>
  );
}
