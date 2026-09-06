import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as reviewsService from "@/admin/services/reviewsService";
import type { GetReviewsParams } from "@/admin/services/reviewsService";
import { reviewKeys } from "@/admin/hooks/queryKeys";
import type { ReviewReorderRequest, ReviewWriteRequest } from "@/admin/types";

export function useReviews(params: GetReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: ({ signal }) => reviewsService.getReviews(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReviewWriteRequest) => reviewsService.createReview(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ReviewWriteRequest }) =>
      reviewsService.updateReview(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
}

/**
 * No `invalidateQueries` here — the caller writes the reordered rows straight
 * into the cache as an optimistic update, and a successful reorder leaves
 * that cache exactly matching the server (the endpoint sets each `sortOrder`
 * to what was sent), so there's nothing left to refetch.
 */
export function useReorderReviews() {
  return useMutation({
    mutationFn: (body: ReviewReorderRequest) =>
      reviewsService.reorderReviews(body),
  });
}
