import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as currenciesService from "@/admin/services/currenciesService";
import type { GetCurrenciesParams } from "@/admin/services/currenciesService";
import { currencyKeys } from "@/admin/hooks/queryKeys";
import type { CurrencyWriteRequest } from "@/admin/types";

export function useCurrencies(params: GetCurrenciesParams) {
  return useQuery({
    queryKey: currencyKeys.list(params),
    queryFn: ({ signal }) => currenciesService.getCurrencies(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CurrencyWriteRequest) =>
      currenciesService.createCurrency(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CurrencyWriteRequest }) =>
      currenciesService.updateCurrency(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => currenciesService.deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
    },
  });
}

export function useRefreshCurrencyRates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => currenciesService.refreshCurrencyRates(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
    },
  });
}
