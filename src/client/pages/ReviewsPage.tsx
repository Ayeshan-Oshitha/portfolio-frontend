import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useReviews } from "@/client/hooks/useReviews";
import { toErrorMessage } from "@/client/services/ApiError";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { ReviewSort } from "@/client/types";
import ReviewsHeader from "@/client/components/reviews-page/ReviewsHeader";
import ReviewsSortControl from "@/client/components/reviews-page/ReviewsSortControl";
import ReviewsGrid from "@/client/components/reviews-page/ReviewsGrid";
import ReviewSubmitForm from "@/client/components/reviews-page/ReviewSubmitForm";
import Testimonial from "@/client/components/testimonial/Testimonial";
import Button from "@/client/components/ui/Button";
import PanelCTA from "@/client/components/ui/PanelCTA";
import Spinner from "@/client/components/ui/Spinner";

export default function ReviewsPage() {
  useDocumentTitle("Client Reviews");

  const [sort, setSort] = useState<ReviewSort>("latest");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useReviews({
    sort,
    pageSize: 50,
  });
  const reviews = useMemo(() => data?.items ?? [], [data]);

  const average = useMemo(() => {
    if (reviews.length === 0) return null;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  // Lead with a genuine top-rated review rather than a hardcoded quote.
  const featured = useMemo(
    () => reviews.find((review) => review.rating === 5) ?? null,
    [reviews],
  );

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-190 w-300 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-87 -right-80 h-195 w-195 fw-amb-2"
      />

      <div className="relative z-2 mx-auto flex max-w-7xl flex-col gap-13 px-4 pt-23 pb-26 sm:px-6 lg:px-8">
        <ReviewsHeader average={average} count={reviews.length} />

        {featured && (
          <Testimonial
            testimonial={{
              id: featured.id,
              quote: featured.reviewText,
              name: featured.name,
              role: featured.position ?? featured.country,
              initials: featured.name.trim().charAt(0).toUpperCase(),
            }}
            className="px-0!"
          />
        )}

        <div className="flex justify-center">
          <Button
            variant={showForm ? "secondary" : "primary"}
            icon={<Plus size={16} />}
            iconPosition="left"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Hide review form" : "Leave a review"}
          </Button>
        </div>

        {showForm && <ReviewSubmitForm onClose={() => setShowForm(false)} />}

        <div>
          <ReviewsSortControl
            sort={sort}
            onSortChange={setSort}
            totalResults={reviews.length}
          />

          {isLoading && (
            <div className="flex justify-center py-24 text-text-muted">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {isError && (
            <div className="py-20 text-center text-danger-400">
              {toErrorMessage(error)}
            </div>
          )}

          {!isLoading && !isError && <ReviewsGrid reviews={reviews} />}
        </div>

        <PanelCTA
          title="Want to talk to one of them?"
          description="We will put you on a call with a client who built something like what you are planning. No sales rep in the room."
          primaryLabel="Ask for a reference"
          primaryHref="/contact"
        />
      </div>
    </div>
  );
}
