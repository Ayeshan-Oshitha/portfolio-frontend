import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/PricingService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * Two cross-field rules matter most: a `custom` price must not carry an
 * amount (that is how "Contact us" is expressed), and a plan cannot be
 * *featured* on a site it is not even *shown* on.
 */

const ISO_CURRENCY = /^[A-Za-z]{3}$/;

const optionalText = z.string().trim().optional();

const wholeNumber = (label: string) =>
  z
    .number({ message: `${label} must be a whole number.` })
    .int(`${label} must be a whole number.`);

/** Registered with a `setValueAs` that maps a blank field to `undefined`. */
const optionalNumber = (label: string) =>
  z.number({ message: `${label} must be a number.` }).optional();

export const PRICE_TYPES = [
  "fixed",
  "starting_from",
  "hourly",
  "monthly",
  "custom",
] as const;

/**
 * A feature row. `id` is present only for one the API already stores, which
 * is how the modal tells an insert from an update on save.
 */
export const pricingFeatureSchema = z.object({
  id: z.string().optional(),
  text: z.string().trim().min(1, "Text is required."),
  isIncluded: z.boolean(),
});

export const pricingPlanSchema = z
  .object({
    // Not a server field — it decides whether `serviceId` is sent at all.
    kind: z.enum(["combo", "service"]),
    serviceId: optionalText,
    name: z.string().trim().min(1, "Name is required."),
    tagline: optionalText,
    description: z.string().trim().min(1, "Description is required."),

    priceType: z.enum(PRICE_TYPES),
    priceAmount: optionalNumber("Price"),
    currency: z.string().trim().min(1, "Currency is required."),
    deliveryDays: optionalNumber("Delivery days"),
    deliveryText: optionalText,

    ctaLabel: optionalText,
    ctaUrl: optionalText,

    isPublished: z.boolean(),
    isPopular: z.boolean(),
    sortOrder: wholeNumber("Tier order"),

    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    agencySortOrder: wholeNumber("Agency order"),
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    personalSortOrder: wholeNumber("Personal order"),

    features: z.array(pricingFeatureSchema),
  })
  .superRefine((values, ctx) => {
    if (values.kind === "service" && !values.serviceId) {
      ctx.addIssue({
        code: "custom",
        path: ["serviceId"],
        message: "Pick a service, or switch the plan to a combo pack.",
      });
    }

    if (values.currency && !ISO_CURRENCY.test(values.currency)) {
      ctx.addIssue({
        code: "custom",
        path: ["currency"],
        message: "Currency must be a 3-letter ISO 4217 code, e.g. 'LKR'.",
      });
    }

    if (values.priceAmount !== undefined) {
      if (values.priceAmount < 0) {
        ctx.addIssue({
          code: "custom",
          path: ["priceAmount"],
          message: "priceAmount cannot be negative.",
        });
      }

      if (values.priceType === "custom") {
        ctx.addIssue({
          code: "custom",
          path: ["priceAmount"],
          message:
            "A custom price cannot carry a priceAmount — leave it null for 'Contact us'.",
        });
      }
    }

    if (values.deliveryDays !== undefined && values.deliveryDays <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["deliveryDays"],
        message: "deliveryDays must be greater than zero.",
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

export type PricingFeatureValues = z.infer<typeof pricingFeatureSchema>;
export type PricingPlanFormValues = z.infer<typeof pricingPlanSchema>;
