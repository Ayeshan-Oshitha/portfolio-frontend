import { useQuery } from "@tanstack/react-query";
import { getCurrencies } from "@/client/services/currenciesService";

/** The active display currencies, ordered by code. */
export function useCurrencies() {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: ({ signal }) => getCurrencies(signal),
    // Rates only change when an admin types a new one, so this is stable for a session.
    staleTime: 60 * 60 * 1000,
  });
}
