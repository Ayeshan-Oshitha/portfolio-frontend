import { useContext } from "react";
import {
  CurrencyContext,
  type CurrencyContextValue,
} from "@/client/context/currencyContext";

export default function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used inside a CurrencyProvider.");
  }
  return context;
}
