import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as tagsService from "@/admin/services/tagsService";
import type { GetTagsParams } from "@/admin/services/tagsService";
import { tagKeys, techCategoryKeys } from "@/admin/hooks/queryKeys";
import type { TagWriteRequest } from "@/admin/types";

export function useTags(params: GetTagsParams) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: ({ signal }) => tagsService.getTags(params, signal),
    placeholderData: (previous) => previous,
  });
}

/** The fixed `TechCategory` list — effectively static, so it's fetched once and kept. */
export function useTechCategories() {
  return useQuery({
    queryKey: techCategoryKeys.all,
    queryFn: ({ signal }) => tagsService.getTechCategories(signal),
    staleTime: Infinity,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TagWriteRequest) => tagsService.createTag(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: TagWriteRequest }) =>
      tagsService.updateTag(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagsService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}
