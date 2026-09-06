import type { ApiCurrency } from "@/client/types";

/**
 * A USD amount rendered in the visitor's currency.
 *
 * Converted prices are rounded to whole units and shown without decimals: these are "from" prices
 * on a marketing page, and `Rs 812,500` reads as a real starting point where `Rs 812,499.75` reads
 * like a quote it is not.
 */
export function formatMoney(amountUsd: number, currency: ApiCurrency): string {
  const converted = amountUsd * currency.rateFromUsd;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    // Intl throws on a code it doesn't know — the currency list is admin-editable, so that is a
    // reachable state rather than a theoretical one.
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }
}
