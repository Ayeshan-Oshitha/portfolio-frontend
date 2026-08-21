import type {
  AdminProject,
  ImageReorderRequest,
  PagedResult,
  ProjectImage,
  ProjectImageWriteRequest,
  ProjectWriteRequest,
  ReorderRequest,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetProjectsParams {
  /** Optional on the admin surface, unlike the public one which demands it. */
  readonly site?: Site;
  /** Omit for both; `true` for published only, `false` for drafts only. */
  readonly isPublished?: boolean;
  /** Case-insensitive match against the title. */
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

/**
 * Ordered by the requested site's sort order when `site` is given, otherwise by
 * the API's default ordering.
 */
export async function getProjects(
  { site, isPublished, search, page, pageSize }: GetProjectsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminProject>> {
  const { data } = await httpClient.get<PagedResult<AdminProject>>(
    "/admin/projects",
    { params: { site, isPublished, search, page, pageSize }, signal },
  );
  return data;
}

export async function getProject(
  id: string,
  signal?: AbortSignal,
): Promise<AdminProject> {
  const { data } = await httpClient.get<AdminProject>(
    `/admin/projects/${id}`,
    { signal },
  );
  return data;
}

export async function createProject(
  body: ProjectWriteRequest,
): Promise<AdminProject> {
  const { data } = await httpClient.post<AdminProject>(
    "/admin/projects",
    body,
  );
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateProject(
  id: string,
  body: ProjectWriteRequest,
): Promise<AdminProject> {
  const { data } = await httpClient.put<AdminProject>(
    `/admin/projects/${id}`,
    body,
  );
  return data;
}

/** Soft delete. The API answers 204 with no body. */
export async function deleteProject(id: string): Promise<void> {
  await httpClient.delete(`/admin/projects/${id}`);
}

/**
 * Flips the draft flag on its own, so the list can take a project live without
 * resubmitting the whole form. Answers with the updated project.
 */
export async function setProjectPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminProject> {
  const { data } = await httpClient.post<AdminProject>(
    `/admin/projects/${id}/publish`,
    { isPublished },
  );
  return data;
}

/**
 * Bulk sort-order update. Sort order is kept per site, so `site` is required —
 * there is no site-agnostic ordering to renumber. Answers 204.
 */
export async function reorderProjects(body: ReorderRequest): Promise<void> {
  await httpClient.post("/admin/projects/reorder", body);
}

export async function addProjectImage(
  projectId: string,
  body: ProjectImageWriteRequest,
): Promise<ProjectImage> {
  const { data } = await httpClient.post<ProjectImage>(
    `/admin/projects/${projectId}/images`,
    body,
  );
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateProjectImage(
  projectId: string,
  imageId: string,
  body: ProjectImageWriteRequest,
): Promise<ProjectImage> {
  const { data } = await httpClient.put<ProjectImage>(
    `/admin/projects/${projectId}/images/${imageId}`,
    body,
  );
  return data;
}

export async function deleteProjectImage(
  projectId: string,
  imageId: string,
): Promise<void> {
  await httpClient.delete(`/admin/projects/${projectId}/images/${imageId}`);
}

/** A single global order — images have no per-site sort column. */
export async function reorderProjectImages(
  projectId: string,
  body: ImageReorderRequest,
): Promise<void> {
  await httpClient.post(`/admin/projects/${projectId}/images/reorder`, body);
}
