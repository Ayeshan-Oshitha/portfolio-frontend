import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as projectsService from "@/admin/services/projectsService";
import type { GetProjectsParams } from "@/admin/services/projectsService";
import { projectKeys } from "@/admin/hooks/queryKeys";
import type {
  ImageReorderRequest,
  ProjectImageWriteRequest,
  ProjectWriteRequest,
  ReorderRequest,
} from "@/admin/types";

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

/**
 * No `invalidateQueries` here — the caller writes the reordered rows straight
 * into the cache as an optimistic update, and a successful reorder leaves
 * that cache exactly matching the server (the endpoint sets each `sortOrder`
 * to what was sent), so there's nothing left to refetch.
 */
export function useReorderProjects() {
  return useMutation({
    mutationFn: (body: ReorderRequest) => projectsService.reorderProjects(body),
  });
}

function invalidateProject(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
) {
  queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
  queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
}

export function useAddProjectImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: string;
      body: ProjectImageWriteRequest;
    }) => projectsService.addProjectImage(projectId, body),
    onSuccess: (_data, { projectId }) =>
      invalidateProject(queryClient, projectId),
  });
}

export function useUpdateProjectImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      imageId,
      body,
    }: {
      projectId: string;
      imageId: string;
      body: ProjectImageWriteRequest;
    }) => projectsService.updateProjectImage(projectId, imageId, body),
    onSuccess: (_data, { projectId }) =>
      invalidateProject(queryClient, projectId),
  });
}

export function useDeleteProjectImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      imageId,
    }: {
      projectId: string;
      imageId: string;
    }) => projectsService.deleteProjectImage(projectId, imageId),
    onSuccess: (_data, { projectId }) =>
      invalidateProject(queryClient, projectId),
  });
}

/**
 * No `invalidateQueries` here — same reasoning as `useReorderProjects`: the
 * caller writes the reordered images straight into the project's query cache
 * as an optimistic update, and the endpoint sets each image's `sortOrder` to
 * exactly what was sent, so a refetch here would just swap in fresh object
 * references a beat later and jolt dnd-kit's drag positions for no reason.
 */
export function useReorderProjectImages() {
  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: string;
      body: ImageReorderRequest;
    }) => projectsService.reorderProjectImages(projectId, body),
  });
}
