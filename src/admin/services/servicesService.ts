import type {
  AdminService,
  PagedResult,
  ReorderRequest,
  ServiceWriteRequest,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetServicesParams {
  /** Omit to list services across both sites — the admin view sees everything. */
  readonly site?: Site;
  readonly isPublished?: boolean;
  /** Case-insensitive match against the name. */
  readonly search?: string;
  /**
   * Skips the show-on-site filter `site` would otherwise apply — the
   * reorder/visibility screen needs every published service in both columns,
   * including ones not yet shown anywhere, since it's the screen that turns
   * showing on in the first place.
   */
  readonly includeHidden?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/**
 * Ordered by name — not by sort order. A screen that cares about the display
 * order has to sort by the site's `agencySortOrder`/`personalSortOrder` itself.
 */
export async function getServices(
  { site, isPublished, search, includeHidden, page, pageSize }: GetServicesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminService>> {
  const { data } = await httpClient.get<PagedResult<AdminService>>(
    "/admin/services",
    { params: { site, isPublished, search, includeHidden, page, pageSize }, signal },
  );
  return data;
}

export async function getService(
  id: string,
  signal?: AbortSignal,
): Promise<AdminService> {
  const { data } = await httpClient.get<AdminService>(`/admin/services/${id}`, {
    signal,
  });
  return data;
}

export async function createService(
  body: ServiceWriteRequest,
): Promise<AdminService> {
  const { data } = await httpClient.post<AdminService>("/admin/services", body);
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateService(
  id: string,
  body: ServiceWriteRequest,
): Promise<AdminService> {
  const { data } = await httpClient.put<AdminService>(
    `/admin/services/${id}`,
    body,
  );
  return data;
}

/** The one partial update the API offers — flips the draft flag on its own. */
export async function setServicePublished(
  id: string,
  isPublished: boolean,
): Promise<AdminService> {
  const { data } = await httpClient.post<AdminService>(
    `/admin/services/${id}/publish`,
    { isPublished },
  );
  return data;
}

/** Soft delete — the row keeps existing behind the API's `IsDeleted` filter. */
export async function deleteService(id: string): Promise<void> {
  await httpClient.delete(`/admin/services/${id}`);
}

/** Renumbers the given services for one site; every id must exist. */
export async function reorderServices(body: ReorderRequest): Promise<void> {
  await httpClient.post("/admin/services/reorder", body);
}
