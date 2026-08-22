import type { ApiReview } from "@/client/types";
import ReviewCard from "./ReviewCard";

interface ReviewsGridProps {
  readonly reviews: readonly ApiReview[];
}

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-lg">
          No reviews yet — be the first to share your experience.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
