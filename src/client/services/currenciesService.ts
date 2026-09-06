import { httpClient } from "@/client/services/httpClient";
import type { ApiCurrency } from "@/client/types";

/** The currencies a visitor may switch to. Active rows only, and not site-scoped. */
export async function getCurrencies(
  signal?: AbortSignal,
): Promise<readonly ApiCurrency[]> {
  const { data } = await httpClient.get<readonly ApiCurrency[]>(
    "/public/currencies",
    { signal },
  );
  return data;
}
