import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/ServiceCatalogService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * Show/featured/sort live on the reorder & visibility screen, not this form,
 * so there's no cross-field "featured requires shown" rule to validate here —
 * that screen enforces it directly by disabling the star icon.
 */

const optionalText = z.string().trim().optional();
const optionalNumber = z.number().optional();

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  slug: optionalText,
  shortDescription: z.string().trim().min(1, "shortDescription is required."),

  eyebrow: optionalText,
  headline: optionalText,
  deck: optionalText,
  whoThisIsFor: optionalText,
  outcomes: optionalText,
  capabilities: optionalText,
  inDepth: optionalText,
  primaryCtaLabel: optionalText,
  primaryCtaUrl: optionalText,
  secondaryCtaLabel: optionalText,
  secondaryCtaUrl: optionalText,

  iconObjectKey: optionalText,
  iconUrl: optionalText,
  iconWidth: optionalNumber,
  iconHeight: optionalNumber,
  iconAltText: optionalText,

  heroImageObjectKey: optionalText,
  heroImageUrl: optionalText,
  heroImageWidth: optionalNumber,
  heroImageHeight: optionalNumber,
  heroImageAltText: optionalText,

  depthImageObjectKey: optionalText,
  depthImageUrl: optionalText,
  depthImageWidth: optionalNumber,
  depthImageHeight: optionalNumber,
  depthImageAltText: optionalText,

  projectIds: z.array(z.string()),

  seoTitle: optionalText,
  seoDescription: optionalText,

  isPublished: z.boolean(),
})
  .refine(
    (values) => !!values.primaryCtaLabel === !!values.primaryCtaUrl,
    { message: "primaryCtaLabel and primaryCtaUrl must be set together.", path: ["primaryCtaUrl"] },
  )
  .refine(
    (values) => !!values.secondaryCtaLabel === !!values.secondaryCtaUrl,
    { message: "secondaryCtaLabel and secondaryCtaUrl must be set together.", path: ["secondaryCtaUrl"] },
  );

export type ServiceFormValues = z.infer<typeof serviceSchema>;
