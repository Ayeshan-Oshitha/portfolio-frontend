import { httpClient } from "@/client/services/httpClient";
import type { ApiFaq, Site } from "@/client/types";

const SITE: Site = "agency";

/** The global FAQ list — service-scoped FAQs ride along on `getService` instead. */
export async function getFaqs(
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<readonly ApiFaq[]> {
  const { data } = await httpClient.get<readonly ApiFaq[]>("/public/faqs", {
    params: { site },
    signal,
  });
  return data;
}
