import { httpClient } from "@/client/services/httpClient";
import { MOCK_PROJECTS } from "@/client/services/mockData";
import ApiError from "@/client/services/ApiError";
import type { ApiProject, PagedResult, Site } from "@/client/types";

export interface GetProjectsParams {
  readonly site?: Site;
  readonly tag?: string;
  readonly category?: string;
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

const SITE: Site = "agency";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export async function getProjects(
  {
    site = SITE,
    tag,
    category,
    featured,
    page = 1,
    pageSize = 20,
  }: GetProjectsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiProject>> {
  if (USE_MOCK_DATA) {
    const items = MOCK_PROJECTS.filter(
      (p) =>
        (!tag || p.tags.some((t) => t.name === tag)) &&
        (!category || p.tags.some((t) => t.name === category)) &&
        (featured === undefined || p.featured === featured),
    );
    return { items, page, pageSize, total: items.length };
  }

  const { data } = await httpClient.get<PagedResult<ApiProject>>(
    "/public/projects",
    { params: { site, tag, category, featured, page, pageSize }, signal },
  );
  return data;
}

export async function getProject(
  slug: string,
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiProject> {
  if (USE_MOCK_DATA) {
    const project = MOCK_PROJECTS.find((p) => p.slug === slug);
    if (!project) throw new ApiError(404, "Project not found.");
    return project;
  }

  const { data } = await httpClient.get<ApiProject>(
    `/public/projects/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
