import type {
  AdminService,
  FeatureReorderRequest,
  PagedResult,
  ReorderRequest,
  ServiceFeature,
  ServiceFeatureWriteRequest,
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
  readonly page?: number;
  readonly pageSize?: number;
}

/**
 * Ordered by name — not by sort order. A screen that cares about the display
 * order has to sort by the site's `agencySortOrder`/`personalSortOrder` itself.
 */
export async function getServices(
  { site, isPublished, search, page, pageSize }: GetServicesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminService>> {
  const { data } = await httpClient.get<PagedResult<AdminService>>(
    "/admin/services",
    { params: { site, isPublished, search, page, pageSize }, signal },
  );
  return data;
}

export async function getService(
  id: string,
  signal?: AbortSignal,
): Promise<AdminService> {
  const { data } = await httpClient.get<AdminService>(
    `/admin/services/${id}`,
    { signal },
  );
  return data;
}

export async function createService(
  body: ServiceWriteRequest,
): Promise<AdminService> {
  const { data } = await httpClient.post<AdminService>(
    "/admin/services",
    body,
  );
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

export async function addServiceFeature(
  serviceId: string,
  body: ServiceFeatureWriteRequest,
): Promise<ServiceFeature> {
  const { data } = await httpClient.post<ServiceFeature>(
    `/admin/services/${serviceId}/features`,
    body,
  );
  return data;
}

export async function updateServiceFeature(
  serviceId: string,
  featureId: string,
  body: ServiceFeatureWriteRequest,
): Promise<ServiceFeature> {
  const { data } = await httpClient.put<ServiceFeature>(
    `/admin/services/${serviceId}/features/${featureId}`,
    body,
  );
  return data;
}

/** Hard delete — features have no soft-delete flag. */
export async function deleteServiceFeature(
  serviceId: string,
  featureId: string,
): Promise<void> {
  await httpClient.delete(`/admin/services/${serviceId}/features/${featureId}`);
}

export async function reorderServiceFeatures(
  serviceId: string,
  body: FeatureReorderRequest,
): Promise<void> {
  await httpClient.post(`/admin/services/${serviceId}/features/reorder`, body);
}
