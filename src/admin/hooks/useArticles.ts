import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as articlesService from "@/admin/services/articlesService";
import type { GetArticlesParams } from "@/admin/services/articlesService";
import { articleKeys } from "@/admin/hooks/queryKeys";
import type { ArticleWriteRequest, ReorderRequest } from "@/admin/types";

export function useArticles(params: GetArticlesParams) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: ({ signal }) => articlesService.getArticles(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useArticle(id: string | undefined) {
  return useQuery({
    queryKey: articleKeys.detail(id ?? ""),
    queryFn: ({ signal }) => articlesService.getArticle(id as string, signal),
    enabled: id !== undefined,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ArticleWriteRequest) =>
      articlesService.createArticle(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ArticleWriteRequest }) =>
      articlesService.updateArticle(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
}

/**
 * No `invalidateQueries` here — the caller writes the reordered rows straight
 * into the cache as an optimistic update, and a successful reorder leaves
 * that cache exactly matching the server (the endpoint sets each `sortOrder`
 * to what was sent), so there's nothing left to refetch.
 */
export function useReorderArticles() {
  return useMutation({
    mutationFn: (body: ReorderRequest) => articlesService.reorderArticles(body),
  });
}
