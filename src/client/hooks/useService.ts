import { useQuery } from "@tanstack/react-query";
import { getService } from "@/client/services/servicesService";

export function useService(slug: string | undefined) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: ({ signal }) => getService(slug!, undefined, signal),
    enabled: Boolean(slug),
    retry: false,
  });
}
