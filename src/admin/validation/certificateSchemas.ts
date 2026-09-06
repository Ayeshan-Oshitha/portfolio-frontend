import { z } from "zod";

/**
 * Mirrors the checks in the API's `Services/CertificateService.cs`.
 * Certificates are personal-site only — no `showOnX`/`featuredOnX` pair, just
 * `featured`, and no editable `sortOrder` — a new certificate is appended to
 * the end server-side, and order only ever changes by dragging rows.
 */

export const certificateSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  issuedBy: z.string().trim().min(1, "Issued by is required."),
  /** Native `<input type="date">` value — already `YYYY-MM-DD`. */
  issuedDate: z.string().min(1, "Issue date is required."),
  marks: z.string().trim().optional(),

  objectKey: z.string().min(1, "Upload a certificate file first."),
  url: z.string().min(1),
  mimeType: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
  altText: z.string().trim().min(1, "Alt text is required."),

  isPublished: z.boolean(),
  featured: z.boolean(),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;
