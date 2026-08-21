import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/TagService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * The conditional rules are the interesting part: a technology tag *must*
 * carry a category and a Cloudinary id, and a plain category tag must carry
 * neither. The form only ever shows the technology fields when the checkbox
 * is on, so the "must be null" half is satisfied by construction.
 */

const HEX_COLOUR = /^#[0-9a-fA-F]{6}$/;

const optionalText = z.string().trim().optional();

export const tagSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    slug: optionalText,
    isTechnology: z.boolean(),
    technologyCategory: optionalText,
    iconCloudinaryId: optionalText,
    iconUrl: optionalText,
    colorHex: optionalText,
    // Registered with `valueAsNumber`, so a blank field arrives as NaN and fails this check, not becomes 0.
    sortOrder: z
      .number({ message: "Sort order must be a whole number." })
      .int("Sort order must be a whole number."),
  })
  .superRefine((values, ctx) => {
    if (values.isTechnology) {
      if (!values.technologyCategory) {
        ctx.addIssue({
          code: "custom",
          path: ["technologyCategory"],
          message: "A category is required for a technology tag.",
        });
      }

      if (!values.iconCloudinaryId) {
        ctx.addIssue({
          code: "custom",
          path: ["iconCloudinaryId"],
          message: "An icon Cloudinary id is required for a technology tag.",
        });
      }
    }

    if (values.colorHex && !HEX_COLOUR.test(values.colorHex)) {
      ctx.addIssue({
        code: "custom",
        path: ["colorHex"],
        message: "colorHex must look like #rrggbb.",
      });
    }
  });

export type TagFormValues = z.infer<typeof tagSchema>;
