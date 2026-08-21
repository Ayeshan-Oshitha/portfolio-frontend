import type {
  AdminPricingPlan,
  FeatureReorderRequest,
  PagedResult,
  PricingFeatureWriteRequest,
  PricingPlanWriteRequest,
  ReorderRequest,
  Site,
} from "@/admin/types";
import { request } from "@/admin/api/client";

export interface GetPricingPlansParams {
  /** Omit to list plans across both sites — the admin view sees everything. */
  readonly site?: Site;
  /** Ignored by the API whenever `comboOnly` is true. */
  readonly serviceId?: string;
  /** `true` narrows to combo packs (the plans with no service). */
  readonly comboOnly?: boolean;
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
export function getPricingPlans(
  {
    site,
    serviceId,
    comboOnly,
    isPublished,
    search,
    page,
    pageSize,
  }: GetPricingPlansParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminPricingPlan>> {
  return request<PagedResult<AdminPricingPlan>>("/admin/pricing-plans", {
    query: { site, serviceId, comboOnly, isPublished, search, page, pageSize },
    signal,
  });
}

export function getPricingPlan(
  id: string,
  signal?: AbortSignal,
): Promise<AdminPricingPlan> {
  return request<AdminPricingPlan>(`/admin/pricing-plans/${id}`, { signal });
}

export function createPricingPlan(
  body: PricingPlanWriteRequest,
): Promise<AdminPricingPlan> {
  return request<AdminPricingPlan>("/admin/pricing-plans", {
    method: "POST",
    body,
  });
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export function updatePricingPlan(
  id: string,
  body: PricingPlanWriteRequest,
): Promise<AdminPricingPlan> {
  return request<AdminPricingPlan>(`/admin/pricing-plans/${id}`, {
    method: "PUT",
    body,
  });
}

/** The one partial update the API offers — flips the draft flag on its own. */
export function setPricingPlanPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminPricingPlan> {
  return request<AdminPricingPlan>(`/admin/pricing-plans/${id}/publish`, {
    method: "POST",
    body: { isPublished },
  });
}

/** Soft delete — the row keeps existing behind the API's `IsDeleted` filter. */
export function deletePricingPlan(id: string): Promise<void> {
  return request<void>(`/admin/pricing-plans/${id}`, { method: "DELETE" });
}

/** Renumbers the given plans for one site; every id must exist. */
export function reorderPricingPlans(body: ReorderRequest): Promise<void> {
  return request<void>("/admin/pricing-plans/reorder", {
    method: "POST",
    body,
  });
}

export function addPricingPlanFeature(
  planId: string,
  body: PricingFeatureWriteRequest,
): Promise<void> {
  return request<void>(`/admin/pricing-plans/${planId}/features`, {
    method: "POST",
    body,
  });
}

export function updatePricingPlanFeature(
  planId: string,
  featureId: string,
  body: PricingFeatureWriteRequest,
): Promise<void> {
  return request<void>(`/admin/pricing-plans/${planId}/features/${featureId}`, {
    method: "PUT",
    body,
  });
}

/** Hard delete — features have no soft-delete flag. */
export function deletePricingPlanFeature(
  planId: string,
  featureId: string,
): Promise<void> {
  return request<void>(`/admin/pricing-plans/${planId}/features/${featureId}`, {
    method: "DELETE",
  });
}

export function reorderPricingPlanFeatures(
  planId: string,
  body: FeatureReorderRequest,
): Promise<void> {
  return request<void>(`/admin/pricing-plans/${planId}/features/reorder`, {
    method: "POST",
    body,
  });
}
