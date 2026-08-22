import { useQuery } from "@tanstack/react-query";
import { getArticle } from "@/client/services/articlesService";
import { mapApiArticleToBlogPost } from "@/client/lib/mappers";

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async ({ signal }) => {
      const api = await getArticle(slug!, undefined, signal);
      return mapApiArticleToBlogPost(api);
    },
    enabled: Boolean(slug),
    retry: false,
  });
}
