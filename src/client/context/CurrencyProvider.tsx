import { useCallback, useMemo, useState } from "react";
import { useCurrencies } from "@/client/hooks/useCurrencies";
import { currencyFromLocale } from "@/client/utils/localeCurrency";
import {
  BASE_CURRENCY,
  CURRENCY_STORAGE_KEY,
  CurrencyContext,
} from "@/client/context/currencyContext";

interface CurrencyProviderProps {
  readonly children: React.ReactNode;
}

function readStoredCurrency(): string | null {
  try {
    return localStorage.getItem(CURRENCY_STORAGE_KEY);
  } catch {
    // Storage is unavailable in private mode; treat it as "no preference".
    return null;
  }
}

function persistCurrency(code: string) {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // The choice just won't survive a reload.
  }
}

export default function CurrencyProvider({ children }: CurrencyProviderProps) {
  const { data } = useCurrencies();
  const [chosen, setChosen] = useState<string | null>(readStoredCurrency);

  const currencies = useMemo(
    () => data ?? [BASE_CURRENCY],
    [data],
  );

  /*
   * Resolution order: what the visitor picked → what their locale suggests → USD. Each step only
   * counts if that currency is actually active, so deactivating one in the admin quietly moves
   * everyone still on it back to USD rather than showing a stale rate.
   */
  const currency = useMemo(() => {
    const find = (code: string | null) =>
      code ? currencies.find((item) => item.code === code) : undefined;

    return (
      find(chosen) ??
      find(currencyFromLocale()) ??
      find(BASE_CURRENCY.code) ??
      BASE_CURRENCY
    );
  }, [chosen, currencies]);

  const setCurrency = useCallback((code: string) => {
    setChosen(code);
    persistCurrency(code);
  }, []);

  const value = useMemo(
    () => ({ currency, currencies, setCurrency }),
    [currency, currencies, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
