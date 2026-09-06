import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/ProjectService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * `showOnAgency`/`featuredOnAgency`/`showOnPersonal`/`featuredOnPersonal` are
 * part of the shape (the API's `ProjectWriteRequest` needs all four on every
 * save) but aren't editable through this form — they're carried through from
 * the loaded project untouched. Reorder & Visibility is what changes them,
 * and it enforces "featured requires shown" itself, so this schema doesn't
 * need to.
 */

/** `ProjectService.EarliestYear`. */
const EARLIEST_YEAR = 1990;

/** The API recomputes this per request, so it is derived rather than frozen. */
function latestYear(): number {
  return new Date().getFullYear() + 1;
}

const optionalText = z.string().trim().optional();

/** Matches `Uri.TryCreate(..., UriKind.Absolute)` plus the scheme check. */
function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const projectSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    slug: optionalText,
    year: z
      .number({ message: "Year must be a whole number." })
      .int("Year must be a whole number."),
    shortDescription: z.string().trim().min(1, "shortDescription is required."),
    description: z.string().trim().min(1, "Description is required."),
    websiteUrl: optionalText,
    problem: optionalText,
    solution: optionalText,
    whatWeDelivered: optionalText,
    proof: optionalText,
    clientName: optionalText,
    isPublished: z.boolean(),
    seoTitle: optionalText,
    seoDescription: optionalText,
    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    tagIds: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    const latest = latestYear();
    if (values.year < EARLIEST_YEAR || values.year > latest) {
      ctx.addIssue({
        code: "custom",
        path: ["year"],
        message: `Year must be between ${EARLIEST_YEAR} and ${latest}.`,
      });
    }

    if (values.websiteUrl && !isAbsoluteHttpUrl(values.websiteUrl)) {
      ctx.addIssue({
        code: "custom",
        path: ["websiteUrl"],
        message: "websiteUrl must be an absolute http(s) URL.",
      });
    }
  });

export type ProjectFormValues = z.infer<typeof projectSchema>;
