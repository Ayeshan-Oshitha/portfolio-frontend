import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/ServiceCatalogService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * The cross-field rule that matters: a service cannot be *featured* on a site
 * it is not even *shown* on.
 */

const optionalText = z.string().trim().optional();

const wholeNumber = (label: string) =>
  z
    .number({ message: `${label} must be a whole number.` })
    .int(`${label} must be a whole number.`);

/**
 * A feature row. `id` is present only for one the API already stores, which
 * is how the modal tells an insert from an update on save.
 */
export const serviceFeatureSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required."),
  description: optionalText,
  iconName: optionalText,
});

export const serviceSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    slug: optionalText,
    shortDescription: z.string().trim().min(1, "shortDescription is required."),
    description: z.string().trim().min(1, "Description is required."),

    iconName: optionalText,
    iconCloudinaryId: optionalText,
    heroImageId: optionalText,

    isPublished: z.boolean(),

    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    agencySortOrder: wholeNumber("Agency order"),
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    personalSortOrder: wholeNumber("Personal order"),

    features: z.array(serviceFeatureSchema),
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

export type ServiceFeatureValues = z.infer<typeof serviceFeatureSchema>;
export type ServiceFormValues = z.infer<typeof serviceSchema>;
