import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/PricingService.cs`,
 * including its wording, so client and server messages stay consistent.
 *
 * Pricing is agency-only — no site fields, no per-site "featured requires
 * shown" cross-check, and no editable sort order field — a new plan is
 * appended to the end of its group server-side, and order only ever changes
 * by dragging rows in the admin list. The one cross-field rule that remains
 * is that a `custom` price must not carry an amount (that is how "Contact
 * us" is expressed).
 */

const ISO_CURRENCY = /^[A-Za-z]{3}$/;

const optionalText = z.string().trim().optional();

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
    deliveryText: optionalText,

    ctaLabel: optionalText,
    ctaUrl: optionalText,

    isPublished: z.boolean(),
    isPopular: z.boolean(),
    featured: z.boolean(),

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

  });

export type PricingFeatureValues = z.infer<typeof pricingFeatureSchema>;
export type PricingPlanFormValues = z.infer<typeof pricingPlanSchema>;
