import { createContext } from "react";
import type { ApiCurrency } from "@/client/types";

export const CURRENCY_STORAGE_KEY = "fwt-currency";

/** Every rate is expressed against this, and it is what a visitor sees when nothing else fits. */
export const BASE_CURRENCY: ApiCurrency = {
  code: "USD",
  name: "US Dollar",
  symbol: "$",
  rateFromUsd: 1,
};

export interface CurrencyContextValue {
  /** The currency prices are shown in. Falls back to USD until the list loads. */
  readonly currency: ApiCurrency;
  /** Everything a visitor may switch to. Empty until the list loads. */
  readonly currencies: readonly ApiCurrency[];
  readonly setCurrency: (code: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);
