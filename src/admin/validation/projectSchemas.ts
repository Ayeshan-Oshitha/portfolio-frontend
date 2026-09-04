import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/ProjectService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * The conditional rules are the interesting part: "featured" is meaningless
 * without "show" on the same site, and the API rejects that pairing outright.
 * The form also disables each featured box until its show box is on, so the
 * refinements below are a backstop rather than the only guard.
 */

/** `ProjectService.EarliestYear`. */
const EARLIEST_YEAR = 1990;

/** The API recomputes this per request, so it is derived rather than frozen. */
function latestYear(): number {
  return new Date().getFullYear() + 1;
}

const optionalText = z.string().trim().optional();

/** Registered with `valueAsNumber`, so a blank field arrives as NaN. */
const sortOrder = z
  .number({ message: "Sort order must be a whole number." })
  .int("Sort order must be a whole number.");

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
    agencySortOrder: sortOrder,
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    personalSortOrder: sortOrder,
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

export type ProjectFormValues = z.infer<typeof projectSchema>;
