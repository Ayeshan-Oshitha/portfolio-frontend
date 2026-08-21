import type { AdminFaq, FaqWriteRequest, PagedResult } from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetFaqsParams {
  readonly search?: string;
  readonly category?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by `sortOrder`. */
export async function getFaqs(
  { search, category, page, pageSize }: GetFaqsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminFaq>> {
  const { data } = await httpClient.get<PagedResult<AdminFaq>>("/admin/faqs", {
    params: { search, category, page, pageSize },
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
