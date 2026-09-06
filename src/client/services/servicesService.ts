import { httpClient } from "@/client/services/httpClient";
import type { ApiService, PagedResult, Site } from "@/client/types";

export interface GetServicesParams {
  readonly site?: Site;
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

const SITE: Site = "agency";

// No VITE_USE_MOCK_DATA branch here, unlike projects/articles/reviews — the
// services page had no live API to mock against until now, so there is no
// existing mock fixture to keep working; add one to mockData.ts if offline
// development against services becomes worth it.

export async function getServices(
  { site = SITE, featured, page = 1, pageSize = 20 }: GetServicesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiService>> {
  const { data } = await httpClient.get<PagedResult<ApiService>>(
    "/public/services",
    { params: { site, featured, page, pageSize }, signal },
  );
  return data;
}

/** The detail response — unlike the list, this carries `projects` and `faqs`. */
export async function getService(
  slug: string,
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiService> {
  const { data } = await httpClient.get<ApiService>(
    `/public/services/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
