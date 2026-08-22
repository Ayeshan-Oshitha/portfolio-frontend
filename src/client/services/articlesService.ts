import { httpClient } from "@/client/services/httpClient";
import { MOCK_ARTICLES } from "@/client/services/mockData";
import ApiError from "@/client/services/ApiError";
import type { ApiArticle, PagedResult, Site } from "@/client/types";

export interface GetArticlesParams {
  readonly site?: Site;
  readonly tag?: string;
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

const SITE: Site = "agency";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export async function getArticles(
  { site = SITE, tag, featured, page = 1, pageSize = 20 }: GetArticlesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiArticle>> {
  if (USE_MOCK_DATA) {
    const items = MOCK_ARTICLES.filter(
      (a) =>
        (!tag || a.tags.some((t) => t.name === tag)) &&
        (featured === undefined || a.featured === featured),
    );
    return { items, page, pageSize, total: items.length };
  }

  const { data } = await httpClient.get<PagedResult<ApiArticle>>(
    "/public/articles",
    { params: { site, tag, featured, page, pageSize }, signal },
  );
  return data;
}

export async function getArticle(
  slug: string,
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiArticle> {
  if (USE_MOCK_DATA) {
    const article = MOCK_ARTICLES.find((a) => (a.slug ?? a.id) === slug);
    if (!article) throw new ApiError(404, "Article not found.");
    return article;
  }

  const { data } = await httpClient.get<ApiArticle>(
    `/public/articles/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
