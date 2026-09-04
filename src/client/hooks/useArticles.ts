import { useQuery } from "@tanstack/react-query";
import {
  getArticles,
  type GetArticlesParams,
} from "@/client/services/articlesService";
import { mapApiArticleToBlogPost } from "@/client/lib/mappers";

export function useArticles(params: GetArticlesParams = {}) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: async ({ signal }) => {
      const result = await getArticles(params, signal);
      return result.items.map(mapApiArticleToBlogPost);
    },
  });
}
