import type {
  AdminUser,
  PagedResult,
  RejectUserRequest,
  UserStatus,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetUsersParams {
  readonly search?: string;
  readonly status?: UserStatus;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getUsers(
  { search, status, page, pageSize }: GetUsersParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminUser>> {
  const { data } = await httpClient.get<PagedResult<AdminUser>>(
    "/admin/users",
    { params: { search, status, page, pageSize }, signal },
  );
  return data;
}

/** Super-admin only. Rejects with 409 if `id` is self or the super admin. */
export async function approveUser(id: string): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    `/admin/users/${id}/approve`,
  );
  return data;
}

/** Super-admin only. Revokes the user's refresh tokens. */
export async function rejectUser(
  id: string,
  body: RejectUserRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    `/admin/users/${id}/reject`,
    body,
  );
  return data;
}

/** Super-admin only. Revokes the user's refresh tokens. */
export async function disableUser(id: string): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    `/admin/users/${id}/disable`,
  );
  return data;
}

/** Soft delete. The API refuses self-deletion with 409 `cannot_delete_self`. */
export async function deleteUser(id: string): Promise<void> {
  await httpClient.delete(`/admin/users/${id}`);
}
