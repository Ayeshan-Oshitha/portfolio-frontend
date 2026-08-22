import { useState, type FormEvent } from "react";
import { Star, Send } from "lucide-react";
import Button from "@/client/components/ui/Button";
import useToast from "@/client/context/useToast";
import { useSubmitReview } from "@/client/hooks/useSubmitReview";
import { toErrorMessage } from "@/client/services/ApiError";

const inputClasses =
  "w-full px-4 py-3 text-sm text-text-primary bg-surface-950 border border-border-default rounded-lg placeholder:text-text-muted transition-colors duration-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30";

const labelClasses =
  "block text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-2";

function emptyForm() {
  return { name: "", country: "", countryCode: "", position: "", reviewText: "" };
}

interface ReviewSubmitFormProps {
  readonly onClose: () => void;
}

export default function ReviewSubmitForm({ onClose }: ReviewSubmitFormProps) {
  const [values, setValues] = useState(emptyForm());
  const [rating, setRating] = useState(5);
  const toast = useToast();
  const submitReviewMutation = useSubmitReview();

  function handleChange(field: keyof ReturnType<typeof emptyForm>, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await submitReviewMutation.mutateAsync({
        name: values.name.trim(),
        country: values.country.trim(),
        countryCode: values.countryCode.trim().toUpperCase(),
        position: values.position.trim() || undefined,
        rating,
        reviewText: values.reviewText.trim(),
      });
      toast.success("Thanks! Your review has been submitted for approval.");
      setValues(emptyForm());
      setRating(5);
      onClose();
    } catch (error) {
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <div className="rounded-2xl bg-surface-900/60 border border-border-subtle p-8 sm:p-10 mb-16">
      <h3 className="text-xl font-bold text-text-primary mb-1">Leave a Review</h3>
      <p className="text-sm text-text-secondary mb-8">
        Your review is moderated and will appear here once approved.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClasses} htmlFor="review-name">
              Name<span className="text-primary-400 ml-0.5">*</span>
            </label>
            <input
              id="review-name"
              required
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="review-position">
              Position
            </label>
            <input
              id="review-position"
              placeholder="Founder, Acme Inc."
              value={values.position}
              onChange={(e) => handleChange("position", e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="review-country">
              Country<span className="text-primary-400 ml-0.5">*</span>
            </label>
            <input
              id="review-country"
              required
              value={values.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="review-country-code">
              Country Code<span className="text-primary-400 ml-0.5">*</span>
            </label>
            <input
              id="review-country-code"
              required
              maxLength={2}
              placeholder="US"
              value={values.countryCode}
              onChange={(e) => handleChange("countryCode", e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <span className={labelClasses}>
            Rating<span className="text-primary-400 ml-0.5">*</span>
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`Rate ${value} out of 5`}
                  onClick={() => setRating(value)}
                  className="p-1"
                >
                  <Star
                    size={22}
                    className={value <= rating ? "fill-primary-400 text-primary-400" : "text-border-default"}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelClasses} htmlFor="review-text">
            Your Review<span className="text-primary-400 ml-0.5">*</span>
          </label>
          <textarea
            id="review-text"
            required
            rows={5}
            maxLength={2000}
            value={values.reviewText}
            onChange={(e) => handleChange("reviewText", e.target.value)}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            icon={<Send size={14} />}
            loading={submitReviewMutation.isPending}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
}
