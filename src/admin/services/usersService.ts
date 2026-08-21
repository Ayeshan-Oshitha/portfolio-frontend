import type { AdminUser, PagedResult } from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetUsersParams {
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getUsers(
  { search, page, pageSize }: GetUsersParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminUser>> {
  const { data } = await httpClient.get<PagedResult<AdminUser>>(
    "/admin/users",
    { params: { search, page, pageSize }, signal },
  );
  return data;
}

/** Soft delete. The API refuses self-deletion with 409 `cannot_delete_self`. */
export async function deleteUser(id: string): Promise<void> {
  await httpClient.delete(`/admin/users/${id}`);
}
