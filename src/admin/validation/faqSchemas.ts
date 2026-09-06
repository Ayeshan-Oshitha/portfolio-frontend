import { z } from "zod";

/**
 * Mirrors the checks in the API's `Services/FaqService.cs`. Unlike
 * Services/Pricing/Articles, FAQs have no "featured" flag, no category, and
 * no editable sort order field — a new FAQ is appended to the end
 * server-side, and order only ever changes by dragging rows in the admin
 * list.
 */

export const faqSchema = z.object({
  /** Empty string means a general FAQ shared by both sites. */
  serviceId: z.string().trim().optional(),
  question: z.string().trim().min(1, "Question is required."),
  answer: z.string().trim().min(1, "Answer is required."),

  isPublished: z.boolean(),

  showOnAgency: z.boolean(),
  showOnPersonal: z.boolean(),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
