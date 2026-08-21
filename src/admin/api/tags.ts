import type {
  AdminTag,
  PagedResult,
  TagWriteRequest,
  TechCategory,
} from "@/admin/types";
import { request } from "@/admin/api/client";

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
export function getTags(
  { search, isTechnology, category, page, pageSize }: GetTagsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminTag>> {
  return request<PagedResult<AdminTag>>("/admin/tags", {
    query: { search, isTechnology, category, page, pageSize },
    signal,
  });
}

export function createTag(body: TagWriteRequest): Promise<AdminTag> {
  return request<AdminTag>("/admin/tags", { method: "POST", body });
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export function updateTag(
  id: string,
  body: TagWriteRequest,
): Promise<AdminTag> {
  return request<AdminTag>(`/admin/tags/${id}`, { method: "PUT", body });
}

/** Soft delete. The API refuses with 409 `tag_in_use` while content still carries it. */
export function deleteTag(id: string): Promise<void> {
  return request<void>(`/admin/tags/${id}`, { method: "DELETE" });
}
