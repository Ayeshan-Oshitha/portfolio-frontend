import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/client/services/projectsService";
import { mapApiProjectToProject } from "@/client/lib/mappers";

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async ({ signal }) => {
      const api = await getProject(slug!, undefined, signal);
      return mapApiProjectToProject(api, 0);
    },
    enabled: Boolean(slug),
    retry: false,
  });
}
