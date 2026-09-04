import { useQuery } from "@tanstack/react-query";
import {
  getReviews,
  type GetReviewsParams,
} from "@/client/services/reviewsService";
import type { ApiReview, PagedResult } from "@/client/types";

export function useReviews(params: GetReviewsParams = {}) {
  return useQuery<PagedResult<ApiReview>>({
    queryKey: ["reviews", params],
    queryFn: ({ signal }) => getReviews(params, signal),
  });
}
