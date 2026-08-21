import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as servicesService from "@/admin/services/servicesService";
import type { GetServicesParams } from "@/admin/services/servicesService";
import { serviceKeys } from "@/admin/hooks/queryKeys";
import type {
  FeatureReorderRequest,
  ReorderRequest,
  ServiceFeatureWriteRequest,
  ServiceWriteRequest,
} from "@/admin/types";

export function useServices(params: GetServicesParams) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: ({ signal }) => servicesService.getServices(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ServiceWriteRequest) =>
      servicesService.createService(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ServiceWriteRequest }) =>
      servicesService.updateService(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useSetServicePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      servicesService.setServicePublished(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useReorderServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReorderRequest) => servicesService.reorderServices(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useAddServiceFeature() {
  return useMutation({
    mutationFn: ({
      serviceId,
      body,
    }: {
      serviceId: string;
      body: ServiceFeatureWriteRequest;
    }) => servicesService.addServiceFeature(serviceId, body),
  });
}

export function useUpdateServiceFeature() {
  return useMutation({
    mutationFn: ({
      serviceId,
      featureId,
      body,
    }: {
      serviceId: string;
      featureId: string;
      body: ServiceFeatureWriteRequest;
    }) => servicesService.updateServiceFeature(serviceId, featureId, body),
  });
}

export function useDeleteServiceFeature() {
  return useMutation({
    mutationFn: ({
      serviceId,
      featureId,
    }: {
      serviceId: string;
      featureId: string;
    }) => servicesService.deleteServiceFeature(serviceId, featureId),
  });
}

export function useReorderServiceFeatures() {
  return useMutation({
    mutationFn: ({
      serviceId,
      body,
    }: {
      serviceId: string;
      body: FeatureReorderRequest;
    }) => servicesService.reorderServiceFeatures(serviceId, body),
  });
}
