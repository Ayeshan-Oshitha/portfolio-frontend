import { z } from "zod";

/**
 * Mirrors the hand-rolled checks in the API's `Services/CurrencyService.cs`, including its
 * wording, so client and server messages stay consistent.
 */

const ISO_CURRENCY = /^[A-Za-z]{3}$/;

/** Kept in step with `CurrencyService.BaseCurrencyCode`. */
export const BASE_CURRENCY_CODE = "USD";

export const currencySchema = z
  .object({
    code: z.string().trim().min(1, "A 3-letter code is required."),
    name: z.string().trim().min(1, "Name is required."),
    symbol: z.string().trim().min(1, "Symbol is required."),
    // Optional — a blank field means "use the live rate." The form maps a blank input to
    // `undefined` via `setValueAs`, never `NaN` or `0`.
    manualRateFromUsd: z.number({ message: "Rate must be a number." }).optional(),
    isActive: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.code && !ISO_CURRENCY.test(values.code)) {
      ctx.addIssue({
        code: "custom",
        path: ["code"],
        message: "Code must be a 3-letter ISO 4217 code, e.g. 'LKR'.",
      });
    }

    if (values.manualRateFromUsd !== undefined && values.manualRateFromUsd <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["manualRateFromUsd"],
        message: "manualRateFromUsd must be greater than zero.",
      });
    }

    // The base is what every other rate is expressed against, and the fallback
    // every visitor sees — the API refuses both of these too.
    if (values.code.trim().toUpperCase() === BASE_CURRENCY_CODE) {
      if (values.manualRateFromUsd !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["manualRateFromUsd"],
          message: `${BASE_CURRENCY_CODE} is the base currency, so its rate must be exactly 1.`,
        });
      }

      if (!values.isActive) {
        ctx.addIssue({
          code: "custom",
          path: ["isActive"],
          message: `${BASE_CURRENCY_CODE} is the fallback every visitor sees and cannot be deactivated.`,
        });
      }
    }
  });

export type CurrencyFormValues = z.infer<typeof currencySchema>;
