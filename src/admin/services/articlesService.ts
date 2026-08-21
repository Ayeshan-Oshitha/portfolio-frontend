import type {
  AdminArticle,
  ArticleWriteRequest,
  PagedResult,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

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
export async function getArticles(
  { site, isPublished, search, page, pageSize }: GetArticlesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminArticle>> {
  const { data } = await httpClient.get<PagedResult<AdminArticle>>(
    "/admin/articles",
    { params: { site, isPublished, search, page, pageSize }, signal },
  );
  return data;
}

export async function createArticle(
  body: ArticleWriteRequest,
): Promise<AdminArticle> {
  const { data } = await httpClient.post<AdminArticle>(
    "/admin/articles",
    body,
  );
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateArticle(
  id: string,
  body: ArticleWriteRequest,
): Promise<AdminArticle> {
  const { data } = await httpClient.put<AdminArticle>(
    `/admin/articles/${id}`,
    body,
  );
  return data;
}

/** Soft delete. The API answers 204 with no body. */
export async function deleteArticle(id: string): Promise<void> {
  await httpClient.delete(`/admin/articles/${id}`);
}
