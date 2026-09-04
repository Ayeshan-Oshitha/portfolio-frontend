import type {
  AdminPricingPlan,
  FeatureReorderRequest,
  PagedResult,
  PricingFeatureWriteRequest,
  PricingPlanWriteRequest,
  ReorderRequest,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

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
export async function getPricingPlans(
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
  const { data } = await httpClient.get<PagedResult<AdminPricingPlan>>(
    "/admin/pricing-plans",
    {
      params: {
        site,
        serviceId,
        comboOnly,
        isPublished,
        search,
        page,
        pageSize,
      },
      signal,
    },
  );
  return data;
}

export async function getPricingPlan(
  id: string,
  signal?: AbortSignal,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.get<AdminPricingPlan>(
    `/admin/pricing-plans/${id}`,
    { signal },
  );
  return data;
}

export async function createPricingPlan(
  body: PricingPlanWriteRequest,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.post<AdminPricingPlan>(
    "/admin/pricing-plans",
    body,
  );
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updatePricingPlan(
  id: string,
  body: PricingPlanWriteRequest,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.put<AdminPricingPlan>(
    `/admin/pricing-plans/${id}`,
    body,
  );
  return data;
}

/** The one partial update the API offers — flips the draft flag on its own. */
export async function setPricingPlanPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.post<AdminPricingPlan>(
    `/admin/pricing-plans/${id}/publish`,
    { isPublished },
  );
  return data;
}

/** Soft delete — the row keeps existing behind the API's `IsDeleted` filter. */
export async function deletePricingPlan(id: string): Promise<void> {
  await httpClient.delete(`/admin/pricing-plans/${id}`);
}

/** Renumbers the given plans for one site; every id must exist. */
export async function reorderPricingPlans(body: ReorderRequest): Promise<void> {
  await httpClient.post("/admin/pricing-plans/reorder", body);
}

export async function addPricingPlanFeature(
  planId: string,
  body: PricingFeatureWriteRequest,
): Promise<void> {
  await httpClient.post(`/admin/pricing-plans/${planId}/features`, body);
}

export async function updatePricingPlanFeature(
  planId: string,
  featureId: string,
  body: PricingFeatureWriteRequest,
): Promise<void> {
  await httpClient.put(
    `/admin/pricing-plans/${planId}/features/${featureId}`,
    body,
  );
}

/** Hard delete — features have no soft-delete flag. */
export async function deletePricingPlanFeature(
  planId: string,
  featureId: string,
): Promise<void> {
  await httpClient.delete(
    `/admin/pricing-plans/${planId}/features/${featureId}`,
  );
}

export async function reorderPricingPlanFeatures(
  planId: string,
  body: FeatureReorderRequest,
): Promise<void> {
  await httpClient.post(
    `/admin/pricing-plans/${planId}/features/reorder`,
    body,
  );
}
