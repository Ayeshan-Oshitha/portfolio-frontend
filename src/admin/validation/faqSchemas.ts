import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/FaqService.cs`.
 *
 * The cross-field rule that matters: an FAQ cannot be *featured* on a site
 * it is not even *shown* on (same rule as Services/Pricing/Articles).
 */

const optionalText = z.string().trim().optional();

const wholeNumber = (label: string) =>
  z
    .number({ message: `${label} must be a whole number.` })
    .int(`${label} must be a whole number.`);

export const faqSchema = z
  .object({
    question: z.string().trim().min(1, "Question is required."),
    answer: z.string().trim().min(1, "Answer is required."),
    category: optionalText,
    sortOrder: wholeNumber("Sort order"),

    isPublished: z.boolean(),

    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    agencySortOrder: wholeNumber("Agency order"),
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    personalSortOrder: wholeNumber("Personal order"),
  })
  .superRefine((values, ctx) => {
    if (values.featuredOnAgency && !values.showOnAgency) {
      ctx.addIssue({
        code: "custom",
        path: ["featuredOnAgency"],
        message: "featuredOnAgency requires showOnAgency.",
      });
    }

    if (values.featuredOnPersonal && !values.showOnPersonal) {
      ctx.addIssue({
        code: "custom",
        path: ["featuredOnPersonal"],
        message: "featuredOnPersonal requires showOnPersonal.",
      });
    }
  });

export type FaqFormValues = z.infer<typeof faqSchema>;
