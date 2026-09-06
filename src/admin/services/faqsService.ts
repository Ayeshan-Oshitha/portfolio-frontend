import type {
  AdminFaq,
  FaqReorderRequest,
  FaqWriteRequest,
  PagedResult,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetFaqsParams {
  readonly search?: string;
  /** Omit for every FAQ regardless of site; the API filters server-side otherwise. */
  readonly site?: Site;
  /** Only FAQs scoped to this service. Wins over `globalOnly` if both are sent. */
  readonly serviceId?: string;
  /** Only FAQs with no service — the shared list both public sites render. */
  readonly globalOnly?: boolean;
  readonly isPublished?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by `sortOrder`, within whichever scope was requested. */
export async function getFaqs(
  {
    search,
    site,
    serviceId,
    globalOnly,
    isPublished,
    page,
    pageSize,
  }: GetFaqsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminFaq>> {
  const { data } = await httpClient.get<PagedResult<AdminFaq>>("/admin/faqs", {
    params: { search, site, serviceId, globalOnly, isPublished, page, pageSize },
    signal,
  });
  return data;
}

export async function createFaq(body: FaqWriteRequest): Promise<AdminFaq> {
  const { data } = await httpClient.post<AdminFaq>("/admin/faqs", body);
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateFaq(
  id: string,
  body: FaqWriteRequest,
): Promise<AdminFaq> {
  const { data } = await httpClient.put<AdminFaq>(`/admin/faqs/${id}`, body);
  return data;
}

export async function deleteFaq(id: string): Promise<void> {
  await httpClient.delete(`/admin/faqs/${id}`);
}

/** Bulk sort-order update — FAQs share one order across both sites. Answers 204. */
export async function reorderFaqs(body: FaqReorderRequest): Promise<void> {
  await httpClient.post("/admin/faqs/reorder", body);
}
