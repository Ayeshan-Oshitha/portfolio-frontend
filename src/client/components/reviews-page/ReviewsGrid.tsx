import type { ApiReview } from "@/client/types";
import ReviewCard from "./ReviewCard";

interface ReviewsGridProps {
  readonly reviews: readonly ApiReview[];
}

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-[20px] border border-card-br bg-card py-20 text-center shadow-card">
        <p className="font-display text-[22px] font-medium text-text-primary">
          No reviews yet.
        </p>
        <p className="mt-2 text-[15px] text-text-secondary">
          Be the first to share your experience.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
