import { ChevronDown } from "lucide-react";
import useCurrency from "@/client/context/useCurrency";

interface CurrencySwitcherProps {
  readonly className?: string;
}

/**
 * Lets a visitor override the currency guessed from their locale.
 *
 * A native `<select>` rather than a custom dropdown: it is three options on a marketing header,
 * and the native control already handles keyboard, mobile and screen readers correctly.
 */
export default function CurrencySwitcher({
  className = "",
}: CurrencySwitcherProps) {
  const { currency, currencies, setCurrency } = useCurrency();

  // Nothing to switch between until the list loads, or if the admin only has USD active.
  if (currencies.length < 2) return null;

  return (
    <div className={`relative ${className}`}>
      <select
        value={currency.code}
        onChange={(event) => setCurrency(event.target.value)}
        aria-label="Display currency"
        title="Display currency"
        className="h-11 cursor-pointer appearance-none rounded-xl border border-raise-br bg-raise pr-8 pl-3.5 text-sm font-bold text-text-secondary transition-colors duration-200 hover:border-hair-strong hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        {currencies.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-text-muted"
      />
    </div>
  );
}
