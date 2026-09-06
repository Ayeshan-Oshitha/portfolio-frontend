/**
 * Maps the browser's locale to a likely currency, so a Sri Lankan visitor sees LKR without
 * having to find the switcher.
 *
 * Deliberately region-based rather than geo-IP: no third-party service, no request on every page
 * load, and nothing to get wrong about a visitor's location. It is a guess, which is why the
 * switcher exists — and an unknown region simply falls through to USD.
 */

/** Region subtag → ISO 4217. Only the regions worth guessing for; everything else gets USD. */
const REGION_CURRENCY: Readonly<Record<string, string>> = {
  LK: "LKR",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  NZ: "NZD",
  IN: "INR",
  SG: "SGD",
  AE: "AED",
  US: "USD",
};

/**
 * The currency the browser's locale suggests, or null when it suggests nothing known.
 * The caller decides whether that currency is actually available.
 */
export function currencyFromLocale(): string | null {
  const locale =
    typeof navigator === "undefined" ? undefined : navigator.language;

  if (!locale) return null;

  // `en-LK` → LK. Intl gives the same answer but throws on a malformed tag.
  const region = locale.split("-")[1]?.toUpperCase();
  if (!region) return null;

  return REGION_CURRENCY[region] ?? null;
}
