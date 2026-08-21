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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
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

export function useReorderArticles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReorderRequest) => articlesService.reorderArticles(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
}
