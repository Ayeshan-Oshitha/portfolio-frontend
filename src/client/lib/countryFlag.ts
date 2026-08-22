/** ISO 3166-1 alpha-2 → flag emoji, via the regional indicator symbol block. */
export function countryCodeToFlag(countryCode: string): string {
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";

  const codePoints = [...code].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}
