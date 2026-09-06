import { useQuery } from "@tanstack/react-query";
import * as mediaService from "@/admin/services/mediaService";
import { mediaKeys } from "@/admin/hooks/queryKeys";

/**
 * The base URL a `media://` token is resolved against to become a loadable
 * `<img>` src. Effectively static, so one fetch per session is enough —
 * every caller shares the same cached result.
 */
export function useMediaConfig() {
  return useQuery({
    queryKey: mediaKeys.config,
    queryFn: mediaService.getMediaConfig,
    staleTime: Infinity,
  });
}
