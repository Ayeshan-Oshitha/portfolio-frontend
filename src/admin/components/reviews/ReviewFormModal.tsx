import { zodResolver } from "@hookform/resolvers/zod";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import { useCreateReview, useUpdateReview } from "@/admin/hooks/useReviews";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminReview, ReviewWriteRequest } from "@/admin/types";
import {
  reviewSchema,
  type ReviewFormValues,
} from "@/admin/validation/reviewSchemas";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Textarea,
} from "@/admin/components/ui";

interface ReviewFormModalProps {
  /** `null` opens the dialog in create mode — an admin manually adding a testimonial. */
  readonly review: AdminReview | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

function blankValues(): ReviewFormValues {
  return {
    name: "",
    country: "",
    countryCode: "",
    position: "",
    rating: 5,
    reviewText: "",
    isPublished: false,
    isFeatured: false,
    sortOrder: 0,
  };
}

function toFormValues(review: AdminReview | null): ReviewFormValues {
  if (!review) return blankValues();

  return {
    name: review.name,
    country: review.country,
    countryCode: review.countryCode,
    position: review.position ?? "",
    rating: review.rating,
    reviewText: review.reviewText,
    isPublished: review.isPublished,
    isFeatured: review.isFeatured,
    sortOrder: review.sortOrder,
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Mounted only while the dialog is open, and keyed on the review by
 * `ReviewsPage`, so the form state starts fresh for every row.
 */
export default function ReviewFormModal({
  review,
  onClose,
  onSaved,
}: ReviewFormModalProps) {
  const toast = useToast();
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const isSaving =
    createReviewMutation.isPending || updateReviewMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<ReviewFormValues>(`review-form:${review?.id ?? "new"}`, {
    resolver: zodResolver(reviewSchema),
    defaultValues: toFormValues(review),
  });

  async function onSubmit(values: ReviewFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field would wipe out.
    const body: ReviewWriteRequest = {
      name: values.name.trim(),
      country: values.country.trim(),
      countryCode: values.countryCode.trim().toUpperCase(),
      position: blank(values.position),
      rating: values.rating,
      reviewText: values.reviewText.trim(),
      isPublished: values.isPublished,
      isFeatured: values.isFeatured,
      sortOrder: values.sortOrder,
    };

    try {
      if (review) {
        await updateReviewMutation.mutateAsync({ id: review.id, body });
        toast.success("Review updated.");
      } else {
        await createReviewMutation.mutateAsync(body);
        toast.success("Review created.");
      }
      clearPersisted();
      onSaved();
      onClose();
    } catch (error) {
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={review ? "Edit review" : "New review"}
      description={
        review
          ? "Every field is sent on save — the API replaces the whole review."
          : "For a testimonial collected elsewhere — not what visitors submit through the public form."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="flex gap-4">
          <Input
            label="Name"
            required
            autoFocus
            containerClassName="flex-1"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Position"
            placeholder="Founder, Acme Inc."
            containerClassName="flex-1"
            error={errors.position?.message}
            {...register("position")}
          />
        </div>

        <div className="flex gap-4">
          <Input
            label="Country"
            required
            containerClassName="flex-1"
            error={errors.country?.message}
            {...register("country")}
          />

          <Input
            label="Country code"
            required
            placeholder="US"
            maxLength={2}
            containerClassName="w-32"
            error={errors.countryCode?.message}
            {...register("countryCode")}
          />

          <Input
            label="Rating"
            type="number"
            required
            min={1}
            max={5}
            step={1}
            containerClassName="w-28"
            error={errors.rating?.message}
            {...register("rating", { valueAsNumber: true })}
          />
        </div>

        <Textarea
          label="Review text"
          required
          rows={5}
          error={errors.reviewText?.message}
          {...register("reviewText")}
        />

        <Checkbox
          label="Published"
          hint="Public submissions land unpublished until an admin approves them here."
          {...register("isPublished")}
        />

        <Checkbox label="Featured" {...register("isFeatured")} />

        <Input
          label="Sort order"
          type="number"
          step={1}
          containerClassName="w-32"
          error={errors.sortOrder?.message}
          {...register("sortOrder", { valueAsNumber: true })}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(review));
              clearPersisted();
            }}
            disabled={isSubmitting || isSaving}
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting || isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={isSubmitting || isSaving}>
            {isSubmitting || isSaving
              ? "Saving…"
              : review
                ? "Save changes"
                : "Create review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
