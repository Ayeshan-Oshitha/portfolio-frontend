import type {
  AdminCertificate,
  CertificateReorderRequest,
  CertificateWriteRequest,
  PagedResult,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetCertificatesParams {
  readonly search?: string;
  readonly isPublished?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by `sortOrder` — certificates share one global order. */
export async function getCertificates(
  { search, isPublished, page, pageSize }: GetCertificatesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminCertificate>> {
  const { data } = await httpClient.get<PagedResult<AdminCertificate>>(
    "/admin/certificates",
    {
      params: { search, isPublished, page, pageSize },
      signal,
    },
  );
  return data;
}

export async function createCertificate(
  body: CertificateWriteRequest,
): Promise<AdminCertificate> {
  const { data } = await httpClient.post<AdminCertificate>(
    "/admin/certificates",
    body,
  );
  return data;
}

/** Full replacement — `body` must carry every field, not just the changed ones. */
export async function updateCertificate(
  id: string,
  body: CertificateWriteRequest,
): Promise<AdminCertificate> {
  const { data } = await httpClient.put<AdminCertificate>(
    `/admin/certificates/${id}`,
    body,
  );
  return data;
}

export async function deleteCertificate(id: string): Promise<void> {
  await httpClient.delete(`/admin/certificates/${id}`);
}

/** Bulk sort-order update — certificates share one global order. Answers 204. */
export async function reorderCertificates(
  body: CertificateReorderRequest,
): Promise<void> {
  await httpClient.post("/admin/certificates/reorder", body);
}
