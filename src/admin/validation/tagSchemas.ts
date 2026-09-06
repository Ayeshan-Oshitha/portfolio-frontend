import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/TagService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * The conditional rule is the interesting part: a technology tag *must*
 * carry a category, and a plain category tag must carry none. The form
 * only ever shows the category field when the checkbox is on, so the
 * "must be null" half is satisfied by construction.
 */

const optionalText = z.string().trim().optional();

export const tagSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    slug: optionalText,
    isTechnology: z.boolean(),
    technologyCategory: optionalText,
  })
  .superRefine((values, ctx) => {
    if (values.isTechnology && !values.technologyCategory) {
      ctx.addIssue({
        code: "custom",
        path: ["technologyCategory"],
        message: "A category is required for a technology tag.",
      });
    }
  });

export type TagFormValues = z.infer<typeof tagSchema>;
