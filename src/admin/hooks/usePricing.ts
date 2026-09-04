import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as pricingService from "@/admin/services/pricingService";
import type { GetPricingPlansParams } from "@/admin/services/pricingService";
import { pricingKeys } from "@/admin/hooks/queryKeys";
import type {
  FeatureReorderRequest,
  PricingFeatureWriteRequest,
  PricingPlanWriteRequest,
  ReorderRequest,
} from "@/admin/types";

export function usePricingPlans(params: GetPricingPlansParams) {
  return useQuery({
    queryKey: pricingKeys.list(params),
    queryFn: ({ signal }) => pricingService.getPricingPlans(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useCreatePricingPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PricingPlanWriteRequest) =>
      pricingService.createPricingPlan(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });
    },
  });
}

export function useUpdatePricingPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: PricingPlanWriteRequest }) =>
      pricingService.updatePricingPlan(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });
    },
  });
}

export function useDeletePricingPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pricingService.deletePricingPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });
    },
  });
}

export function useSetPricingPlanPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      pricingService.setPricingPlanPublished(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });
    },
  });
}

export function useReorderPricingPlans() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReorderRequest) =>
      pricingService.reorderPricingPlans(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });
    },
  });
}

export function useAddPricingPlanFeature() {
  return useMutation({
    mutationFn: ({
      planId,
      body,
    }: {
      planId: string;
      body: PricingFeatureWriteRequest;
    }) => pricingService.addPricingPlanFeature(planId, body),
  });
}

export function useUpdatePricingPlanFeature() {
  return useMutation({
    mutationFn: ({
      planId,
      featureId,
      body,
    }: {
      planId: string;
      featureId: string;
      body: PricingFeatureWriteRequest;
    }) => pricingService.updatePricingPlanFeature(planId, featureId, body),
  });
}

export function useDeletePricingPlanFeature() {
  return useMutation({
    mutationFn: ({
      planId,
      featureId,
    }: {
      planId: string;
      featureId: string;
    }) => pricingService.deletePricingPlanFeature(planId, featureId),
  });
}

export function useReorderPricingPlanFeatures() {
  return useMutation({
    mutationFn: ({
      planId,
      body,
    }: {
      planId: string;
      body: FeatureReorderRequest;
    }) => pricingService.reorderPricingPlanFeatures(planId, body),
  });
}
