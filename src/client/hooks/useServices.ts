import { useQuery } from "@tanstack/react-query";
import {
  getServices,
  type GetServicesParams,
} from "@/client/services/servicesService";

export function useServices(params: GetServicesParams = {}) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: ({ signal }) => getServices(params, signal),
  });
}
