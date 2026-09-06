import type {
  AdminContactSubmission,
  ContactSubmissionStatus,
  ContactSubmissionUpdateRequest,
  PagedResult,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetContactSubmissionsParams {
  readonly status?: ContactSubmissionStatus;
  readonly site?: Site;
  readonly serviceId?: string;
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getContactSubmissions(
  { status, site, serviceId, search, page, pageSize }: GetContactSubmissionsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminContactSubmission>> {
  const { data } = await httpClient.get<PagedResult<AdminContactSubmission>>(
    "/admin/contact-submissions",
    { params: { status, site, serviceId, search, page, pageSize }, signal },
  );
  return data;
}

export async function getContactSubmission(
  id: string,
  signal?: AbortSignal,
): Promise<AdminContactSubmission> {
  const { data } = await httpClient.get<AdminContactSubmission>(
    `/admin/contact-submissions/${id}`,
    { signal },
  );
  return data;
}

/** Triage only — status and internal notes. Moving status to `replied` stamps repliedAt/repliedBy server-side. */
export async function updateContactSubmission(
  id: string,
  body: ContactSubmissionUpdateRequest,
): Promise<AdminContactSubmission> {
  const { data } = await httpClient.put<AdminContactSubmission>(
    `/admin/contact-submissions/${id}`,
    body,
  );
  return data;
}

/** Soft delete. */
export async function deleteContactSubmission(id: string): Promise<void> {
  await httpClient.delete(`/admin/contact-submissions/${id}`);
}
