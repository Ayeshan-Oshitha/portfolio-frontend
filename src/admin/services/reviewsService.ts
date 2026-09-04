import type {
  AdminReview,
  PagedResult,
  ReviewReorderRequest,
  ReviewWriteRequest,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetReviewsParams {
  readonly isPublished?: boolean;
  readonly isFeatured?: boolean;
  readonly country?: string;
  /** Case-insensitive match, likely against name/reviewText. */
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getReviews(
  {
    isPublished,
    isFeatured,
    country,
    search,
    page,
    pageSize,
  }: GetReviewsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminReview>> {
  const { data } = await httpClient.get<PagedResult<AdminReview>>(
    "/admin/reviews",
    {
      params: { isPublished, isFeatured, country, search, page, pageSize },
      signal,
    },
  );
  return data;
}

/** For an admin manually adding a testimonial collected elsewhere. */
export async function createReview(
  body: ReviewWriteRequest,
): Promise<AdminReview> {
  const { data } = await httpClient.post<AdminReview>("/admin/reviews", body);
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateReview(
  id: string,
  body: ReviewWriteRequest,
): Promise<AdminReview> {
  const { data } = await httpClient.put<AdminReview>(
    `/admin/reviews/${id}`,
    body,
  );
  return data;
}

/** Soft delete. The API answers 204 with no body. */
export async function deleteReview(id: string): Promise<void> {
  await httpClient.delete(`/admin/reviews/${id}`);
}

/**
 * Bulk sort-order update. Reviews aren't split per site, unlike
 * articles/services/projects/FAQs, so the body carries no site. Answers 204.
 */
export async function reorderReviews(
  body: ReviewReorderRequest,
): Promise<void> {
  await httpClient.post("/admin/reviews/reorder", body);
}
