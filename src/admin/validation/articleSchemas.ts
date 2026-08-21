import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/ArticleService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * The conditional rules are the interesting part: "featured" is meaningless
 * without "show" on the same site, and the API rejects that pairing outright.
 * The form also disables each featured box until its show box is on, so the
 * refinements below are a backstop rather than the only guard.
 */

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const optionalText = z.string().trim().optional();

/** Registered with `valueAsNumber`, so a blank field arrives as NaN. */
const sortOrder = z
  .number({ message: "Sort order must be a whole number." })
  .int("Sort order must be a whole number.");

export const articleSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    excerpt: z.string().trim().min(1, "Excerpt is required."),
    slug: optionalText,
    publishedDate: z
      .string()
      .regex(DATE_ONLY, "Published date must be a calendar date."),
    mediumUrl: optionalText,
    coverImageKey: optionalText,
    contentMarkdown: optionalText,
    isPublished: z.boolean(),
    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    agencySortOrder: sortOrder,
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    personalSortOrder: sortOrder,
    tagIds: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    // Optional cross-post link — only validated when present, same as the API.
    if (values.mediumUrl) {
      let isAbsoluteHttp = false;
      try {
        const parsed = new URL(values.mediumUrl);
        isAbsoluteHttp = parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        isAbsoluteHttp = false;
      }

      if (!isAbsoluteHttp) {
        ctx.addIssue({
          code: "custom",
          path: ["mediumUrl"],
          message: "mediumUrl must be an absolute http(s) URL.",
        });
      }
    }

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

export type ArticleFormValues = z.infer<typeof articleSchema>;
