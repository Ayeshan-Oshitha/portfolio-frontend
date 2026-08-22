import { useQuery } from "@tanstack/react-query";
import { getProjects, type GetProjectsParams } from "@/client/services/projectsService";
import { mapApiProjectToProject } from "@/client/lib/mappers";

export function useProjects(params: GetProjectsParams = {}) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async ({ signal }) => {
      const result = await getProjects(params, signal);
      return result.items.map(mapApiProjectToProject);
    },
  });
}
