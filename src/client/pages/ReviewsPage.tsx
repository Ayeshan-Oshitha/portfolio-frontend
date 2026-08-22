import { useState } from "react";
import { Plus } from "lucide-react";
import { useReviews } from "@/client/hooks/useReviews";
import { toErrorMessage } from "@/client/services/ApiError";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { ReviewSort } from "@/client/types";
import ReviewsHeader from "@/client/components/reviews-page/ReviewsHeader";
import ReviewsSortControl from "@/client/components/reviews-page/ReviewsSortControl";
import ReviewsGrid from "@/client/components/reviews-page/ReviewsGrid";
import ReviewSubmitForm from "@/client/components/reviews-page/ReviewSubmitForm";
import Button from "@/client/components/ui/Button";
import Spinner from "@/client/components/ui/Spinner";

export default function ReviewsPage() {
  useDocumentTitle("Client Reviews");

  const [sort, setSort] = useState<ReviewSort>("latest");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useReviews({ sort, pageSize: 50 });
  const reviews = data?.items ?? [];

  return (
    <div className="relative pt-32 pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReviewsHeader />

        <div className="flex justify-center mb-12">
          <Button
            variant={showForm ? "secondary" : "primary"}
            icon={<Plus size={16} />}
            iconPosition="left"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Hide Review Form" : "Leave a Review"}
          </Button>
        </div>

        {showForm && <ReviewSubmitForm onClose={() => setShowForm(false)} />}

        <ReviewsSortControl sort={sort} onSortChange={setSort} totalResults={reviews.length} />

        {isLoading && (
          <div className="flex justify-center py-24 text-text-muted">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {isError && (
          <div className="py-20 text-center text-danger-400">{toErrorMessage(error)}</div>
        )}

        {!isLoading && !isError && <ReviewsGrid reviews={reviews} />}
      </div>
    </div>
  );
}
