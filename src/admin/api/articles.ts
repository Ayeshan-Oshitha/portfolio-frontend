import type {
  AdminArticle,
  ArticleWriteRequest,
  PagedResult,
  Site,
} from "@/admin/types";
import { request } from "@/admin/api/client";

export interface GetArticlesParams {
  /** Optional on the admin surface, unlike the public one which demands it. */
  readonly site?: Site;
  /** Omit for both; `true` for published only, `false` for drafts only. */
  readonly isPublished?: boolean;
  /** Case-insensitive match against the title. */
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by `publishedDate` descending, then title. */
export function getArticles(
  { site, isPublished, search, page, pageSize }: GetArticlesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminArticle>> {
  return request<PagedResult<AdminArticle>>("/admin/articles", {
    query: { site, isPublished, search, page, pageSize },
    signal,
  });
}

export function createArticle(
  body: ArticleWriteRequest,
): Promise<AdminArticle> {
  return request<AdminArticle>("/admin/articles", { method: "POST", body });
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export function updateArticle(
  id: string,
  body: ArticleWriteRequest,
): Promise<AdminArticle> {
  return request<AdminArticle>(`/admin/articles/${id}`, { method: "PUT", body });
}

/** Soft delete. The API answers 204 with no body. */
export function deleteArticle(id: string): Promise<void> {
  return request<void>(`/admin/articles/${id}`, { method: "DELETE" });
}
