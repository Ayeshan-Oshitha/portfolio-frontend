import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as faqsService from "@/admin/services/faqsService";
import type { GetFaqsParams } from "@/admin/services/faqsService";
import { faqKeys } from "@/admin/hooks/queryKeys";
import type { FaqWriteRequest } from "@/admin/types";

export function useFaqs(params: GetFaqsParams) {
  return useQuery({
    queryKey: faqKeys.list(params),
    queryFn: ({ signal }) => faqsService.getFaqs(params, signal),
    placeholderData: (previous) => previous,
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
