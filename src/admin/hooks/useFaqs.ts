import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as faqsService from "@/admin/services/faqsService";
import type { GetFaqsParams } from "@/admin/services/faqsService";
import { faqKeys } from "@/admin/hooks/queryKeys";
import type { FaqReorderRequest, FaqWriteRequest } from "@/admin/types";

/**
 * `enabled: false` skips the request entirely rather than fetching and
 * discarding the result — used when the site checkboxes leave nothing
 * selected, since there is no query that means "match no site".
 */
export function useFaqs(params: GetFaqsParams, enabled = true) {
  return useQuery({
    queryKey: faqKeys.list(params),
    queryFn: ({ signal }) => faqsService.getFaqs(params, signal),
    placeholderData: (previous) => previous,
    enabled,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FaqWriteRequest) => faqsService.createFaq(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: FaqWriteRequest }) =>
      faqsService.updateFaq(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => faqsService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}

/**
 * No `invalidateQueries` here — the caller writes the reordered rows straight
 * into the cache as an optimistic update, and a successful reorder leaves
 * that cache exactly matching the server (the endpoint sets each `sortOrder`
 * to what was sent), so there's nothing left to refetch.
 */
export function useReorderFaqs() {
  return useMutation({
    mutationFn: (body: FaqReorderRequest) => faqsService.reorderFaqs(body),
  });
}
