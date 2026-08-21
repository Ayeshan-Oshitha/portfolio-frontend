import type { UploadSignatureRequest, UploadSignatureResponse } from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

/** Feeds a direct, signed upload from the browser straight to Cloudinary. */
export async function createUploadSignature(
  body: UploadSignatureRequest,
): Promise<UploadSignatureResponse> {
  const { data } = await httpClient.post<UploadSignatureResponse>(
    "/admin/media/signature",
    body,
  );
  return data;
}
