import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as projectsService from "@/admin/services/projectsService";
import type { GetProjectsParams } from "@/admin/services/projectsService";
import { projectKeys } from "@/admin/hooks/queryKeys";
import type { ProjectWriteRequest, ReorderRequest } from "@/admin/types";

export function useProjects(params: GetProjectsParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: ({ signal }) => projectsService.getProjects(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ""),
    queryFn: ({ signal }) => projectsService.getProject(id as string, signal),
    enabled: id !== undefined,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProjectWriteRequest) =>
      projectsService.createProject(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProjectWriteRequest }) =>
      projectsService.updateProject(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useSetProjectPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      projectsService.setProjectPublished(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useReorderProjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReorderRequest) => projectsService.reorderProjects(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
