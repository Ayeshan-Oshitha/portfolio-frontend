import type {
  AdminProject,
  PagedResult,
  ProjectWriteRequest,
  ReorderRequest,
  Site,
} from "@/admin/types";
import { request } from "@/admin/api/client";

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
export function getProjects(
  { site, isPublished, search, page, pageSize }: GetProjectsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminProject>> {
  return request<PagedResult<AdminProject>>("/admin/projects", {
    query: { site, isPublished, search, page, pageSize },
    signal,
  });
}

export function getProject(
  id: string,
  signal?: AbortSignal,
): Promise<AdminProject> {
  return request<AdminProject>(`/admin/projects/${id}`, { signal });
}

export function createProject(
  body: ProjectWriteRequest,
): Promise<AdminProject> {
  return request<AdminProject>("/admin/projects", { method: "POST", body });
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export function updateProject(
  id: string,
  body: ProjectWriteRequest,
): Promise<AdminProject> {
  return request<AdminProject>(`/admin/projects/${id}`, { method: "PUT", body });
}

/** Soft delete. The API answers 204 with no body. */
export function deleteProject(id: string): Promise<void> {
  return request<void>(`/admin/projects/${id}`, { method: "DELETE" });
}

/**
 * Flips the draft flag on its own, so the list can take a project live without
 * resubmitting the whole form. Answers with the updated project.
 */
export function setProjectPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminProject> {
  return request<AdminProject>(`/admin/projects/${id}/publish`, {
    method: "POST",
    body: { isPublished },
  });
}

/**
 * Bulk sort-order update. Sort order is kept per site, so `site` is required —
 * there is no site-agnostic ordering to renumber. Answers 204.
 */
export function reorderProjects(body: ReorderRequest): Promise<void> {
  return request<void>("/admin/projects/reorder", { method: "POST", body });
}
