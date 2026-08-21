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
import { request } from "@/admin/api/client";

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
export function getServices(
  { site, isPublished, search, page, pageSize }: GetServicesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminService>> {
  return request<PagedResult<AdminService>>("/admin/services", {
    query: { site, isPublished, search, page, pageSize },
    signal,
  });
}

export function getService(
  id: string,
  signal?: AbortSignal,
): Promise<AdminService> {
  return request<AdminService>(`/admin/services/${id}`, { signal });
}

export function createService(
  body: ServiceWriteRequest,
): Promise<AdminService> {
  return request<AdminService>("/admin/services", { method: "POST", body });
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export function updateService(
  id: string,
  body: ServiceWriteRequest,
): Promise<AdminService> {
  return request<AdminService>(`/admin/services/${id}`, { method: "PUT", body });
}

/** The one partial update the API offers — flips the draft flag on its own. */
export function setServicePublished(
  id: string,
  isPublished: boolean,
): Promise<AdminService> {
  return request<AdminService>(`/admin/services/${id}/publish`, {
    method: "POST",
    body: { isPublished },
  });
}

/** Soft delete — the row keeps existing behind the API's `IsDeleted` filter. */
export function deleteService(id: string): Promise<void> {
  return request<void>(`/admin/services/${id}`, { method: "DELETE" });
}

/** Renumbers the given services for one site; every id must exist. */
export function reorderServices(body: ReorderRequest): Promise<void> {
  return request<void>("/admin/services/reorder", { method: "POST", body });
}

export function addServiceFeature(
  serviceId: string,
  body: ServiceFeatureWriteRequest,
): Promise<ServiceFeature> {
  return request<ServiceFeature>(`/admin/services/${serviceId}/features`, {
    method: "POST",
    body,
  });
}

export function updateServiceFeature(
  serviceId: string,
  featureId: string,
  body: ServiceFeatureWriteRequest,
): Promise<ServiceFeature> {
  return request<ServiceFeature>(
    `/admin/services/${serviceId}/features/${featureId}`,
    { method: "PUT", body },
  );
}

/** Hard delete — features have no soft-delete flag. */
export function deleteServiceFeature(
  serviceId: string,
  featureId: string,
): Promise<void> {
  return request<void>(`/admin/services/${serviceId}/features/${featureId}`, {
    method: "DELETE",
  });
}

export function reorderServiceFeatures(
  serviceId: string,
  body: FeatureReorderRequest,
): Promise<void> {
  return request<void>(`/admin/services/${serviceId}/features/reorder`, {
    method: "POST",
    body,
  });
}
