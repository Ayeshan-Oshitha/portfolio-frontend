import { z } from "zod";

/** Mirrors the hand-rolled checks in the API's `Services/ReviewService.cs`. */

const optionalText = z.string().trim().optional();

/** Registered with `valueAsNumber`, so a blank field arrives as NaN. */
const sortOrder = z
  .number({ message: "Sort order must be a whole number." })
  .int("Sort order must be a whole number.");

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  country: z.string().trim().min(1, "Country is required."),
  countryCode: z
    .string()
    .trim()
    .length(2, "Country code must be a 2-letter ISO code.")
    .toUpperCase(),
  position: optionalText,
  rating: z
    .number({ message: "Rating is required." })
    .int("Rating must be a whole number.")
    .min(1, "Rating must be between 1 and 5.")
    .max(5, "Rating must be between 1 and 5."),
  reviewText: z.string().trim().min(1, "Review text is required."),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder,
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
