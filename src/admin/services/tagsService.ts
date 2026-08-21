import type {
  AdminTag,
  PagedResult,
  TagWriteRequest,
  TechCategory,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetTagsParams {
  /** Case-insensitive match against the name. */
  readonly search?: string;
  /** Omit for both kinds; `true` for technologies, `false` for categories. */
  readonly isTechnology?: boolean;
  readonly category?: TechCategory;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by `sortOrder`, then name. */
export async function getTags(
  { search, isTechnology, category, page, pageSize }: GetTagsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminTag>> {
  const { data } = await httpClient.get<PagedResult<AdminTag>>("/admin/tags", {
    params: { search, isTechnology, category, page, pageSize },
    signal,
  });
  return data;
}

export async function createTag(body: TagWriteRequest): Promise<AdminTag> {
  const { data } = await httpClient.post<AdminTag>("/admin/tags", body);
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateTag(
  id: string,
  body: TagWriteRequest,
): Promise<AdminTag> {
  const { data } = await httpClient.put<AdminTag>(`/admin/tags/${id}`, body);
  return data;
}

/** Soft delete. The API refuses with 409 `tag_in_use` while content still carries it. */
export async function deleteTag(id: string): Promise<void> {
  await httpClient.delete(`/admin/tags/${id}`);
}
