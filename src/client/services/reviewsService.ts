import { httpClient } from "@/client/services/httpClient";
import { MOCK_REVIEWS } from "@/client/services/mockData";
import type {
  ApiReview,
  PagedResult,
  ReviewSort,
  SubmitReviewPayload,
} from "@/client/types";

export interface GetReviewsParams {
  readonly sort?: ReviewSort;
  readonly page?: number;
  readonly pageSize?: number;
}

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

function sortReviews(
  reviews: readonly ApiReview[],
  sort: ReviewSort,
): readonly ApiReview[] {
  const copy = [...reviews];
  if (sort === "rating") return copy.sort((a, b) => b.rating - a.rating);
  if (sort === "country") return copy.sort((a, b) => a.country.localeCompare(b.country));
  return copy.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getReviews(
  { sort = "latest", page = 1, pageSize = 20 }: GetReviewsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiReview>> {
  if (USE_MOCK_DATA) {
    const items = sortReviews(MOCK_REVIEWS, sort);
    return { items, page, pageSize, total: items.length };
  }

  const { data } = await httpClient.get<PagedResult<ApiReview>>(
    "/public/reviews",
    { params: { sort, page, pageSize }, signal },
  );
  return data;
}

/** Lands unpublished — an admin has to approve it before it appears anywhere. */
export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<{ id: string }> {
  if (USE_MOCK_DATA) {
    return { id: `mock-review-${Date.now()}` };
  }

  const { data } = await httpClient.post<{ id: string }>(
    "/public/reviews",
    payload,
  );
  return data;
}
