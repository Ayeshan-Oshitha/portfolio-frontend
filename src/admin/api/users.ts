import type { AdminUser, PagedResult } from "@/admin/types";
import { request } from "@/admin/api/client";

export interface GetUsersParams {
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export function getUsers(
  { search, page, pageSize }: GetUsersParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminUser>> {
  return request<PagedResult<AdminUser>>("/admin/users", {
    query: { search, page, pageSize },
    signal,
  });
}

/** Soft delete. The API refuses self-deletion with 409 `cannot_delete_self`. */
export function deleteUser(id: string): Promise<void> {
  return request<void>(`/admin/users/${id}`, { method: "DELETE" });
}
