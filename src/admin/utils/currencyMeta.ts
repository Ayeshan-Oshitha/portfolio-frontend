import type { SelectOption } from "@/admin/components/ui";

/**
 * Currency names and symbols, read out of the browser rather than a table we maintain.
 * `Intl.supportedValuesOf("currency")` knows every ISO 4217 code (162 of them), and
 * `Intl.DisplayNames` names them — so adding a currency in the admin is a pick, not three
 * fields of typing.
 *
 * Everything here is memoised at module level: the lists are the same for the whole session.
 */

/** Safari gained `supportedValuesOf` in 15.4; the form falls back to free text without it. */
export const CURRENCY_PICKER_SUPPORTED =
  typeof Intl.supportedValuesOf === "function";

let codes: readonly string[] | null = null;

function supportedCodes(): readonly string[] {
  if (codes) return codes;

  try {
    codes = CURRENCY_PICKER_SUPPORTED ? Intl.supportedValuesOf("currency") : [];
  } catch {
    codes = [];
  }

  return codes;
}

/**
 * The raw symbol Intl gives for a code in one display mode, or null when it has none to give.
 * `formatToParts` rather than `format` because it isolates the symbol from the digits and any
 * locale-specific spacing.
 */
function symbolPart(
  code: string,
  currencyDisplay: "symbol" | "narrowSymbol",
): string | null {
  try {
    return (
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        currencyDisplay,
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? null
    );
  } catch {
    // Intl rejects anything that isn't a well-formed currency code.
    return null;
  }
}

let sharedNarrowSymbols: ReadonlySet<string> | null = null;

/**
 * Narrow symbols that more than one currency claims.
 *
 * The narrow form is usually what you want — LKR narrows to "Rs" where its plain symbol is just
 * "LKR". But the dollar family all narrow to a bare "$", which is worse than useless on a page
 * that exists to tell currencies apart. So a narrow symbol is only used when it belongs to
 * exactly one currency; the ¥ and £ families fall out of the same rule.
 */
function ambiguousNarrowSymbols(): ReadonlySet<string> {
  if (sharedNarrowSymbols) return sharedNarrowSymbols;

  const seen = new Map<string, number>();

  for (const code of supportedCodes()) {
    const narrow = symbolPart(code, "narrowSymbol");
    if (narrow) seen.set(narrow, (seen.get(narrow) ?? 0) + 1);
  }

  sharedNarrowSymbols = new Set(
    [...seen.entries()].filter(([, count]) => count > 1).map(([symbol]) => symbol),
  );

  return sharedNarrowSymbols;
}

/** "Sri Lankan Rupee" for `LKR`; the code itself when Intl has no name for it. */
export function currencyName(code: string): string {
  const normalized = code.trim().toUpperCase();

  try {
    const name = new Intl.DisplayNames(undefined, {
      type: "currency",
    }).of(normalized);

    // Intl echoes the input back when it knows no name, which is the fallback anyway.
    return name ?? normalized;
  } catch {
    return normalized;
  }
}

/** "Rs" for `LKR`, "A$" for `AUD` — see {@link ambiguousNarrowSymbols}. */
export function currencySymbol(code: string): string {
  const normalized = code.trim().toUpperCase();

  const narrow = symbolPart(normalized, "narrowSymbol");
  if (narrow && !ambiguousNarrowSymbols().has(narrow)) {
    return narrow;
  }

  return symbolPart(normalized, "symbol") ?? narrow ?? normalized;
}

let options: readonly SelectOption[] | null = null;

/**
 * Every currency, as `LKR — Sri Lankan Rupee`. `Combobox` filters on the label, so that shape is
 * what makes the picker findable by code and by name alike.
 */
export function currencyCodeOptions(): readonly SelectOption[] {
  if (options) return options;

  options = supportedCodes().map((code) => ({
    value: code,
    label: `${code} — ${currencyName(code)}`,
  }));

  return options;
}
