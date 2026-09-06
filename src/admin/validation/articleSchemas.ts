import { z } from "zod";
import { extractMarkdownImages } from "@/admin/utils/markdownImages";

/**
 * `showOnAgency`/`featuredOnAgency`/`showOnPersonal`/`featuredOnPersonal` are
 * part of the shape (the API's `ArticleWriteRequest` needs all four on every
 * save) but aren't editable through this form anymore — they're carried
 * through from the loaded article untouched. Reorder & Visibility is what
 * changes them, and it enforces "featured requires shown" itself, so this
 * schema doesn't need to.
 */

const optionalText = z.string().trim().optional();

export const articleSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    excerpt: z.string().trim().min(1, "Excerpt is required."),
    slug: optionalText,
    /** Stores the image's public url, picked from the images used in the body. */
    coverImageKey: z
      .string()
      .trim()
      .min(1, "Pick a cover image from the images in your content."),
    contentMarkdown: optionalText,
    isPublished: z.boolean(),
    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    tagIds: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    // The cover has to be one of the article's own images: the API stores the
    // url verbatim and never resolves it, so a cover pointing at something the
    // body doesn't carry is how a dead image reaches the public site.
    if (
      values.coverImageKey &&
      !extractMarkdownImages(values.contentMarkdown).includes(
        values.coverImageKey,
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["coverImageKey"],
        message: "The cover must be one of the images used in the content.",
      });
    }
  });

export type ArticleFormValues = z.infer<typeof articleSchema>;
