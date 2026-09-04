import axios from "axios";
import type {
  PresignedUploadRequest,
  PresignedUploadResponse,
  UploadSignatureRequest,
  UploadSignatureResponse,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

/**
 * Step one of the upload flow: the API signs a PUT URL against Neon Object
 * Storage. Signing is local to the API, so this is cheap.
 */
export async function createPresignedUpload(
  body: PresignedUploadRequest,
): Promise<PresignedUploadResponse> {
  const { data } = await httpClient.post<PresignedUploadResponse>(
    "/admin/media/presigned-upload",
    body,
  );
  return data;
}

/**
 * Step two: the raw bytes go straight to storage, not through `httpClient` —
 * the presigned URL is the authorization, and sending our bearer token to a
 * third-party host would leak it.
 */
export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
}

/** Uploads a file and resolves to the URL it will be readable at. */
export async function uploadImage(
  request: PresignedUploadRequest,
  file: File,
): Promise<string> {
  const presigned = await createPresignedUpload(request);
  await uploadToPresignedUrl(presigned.uploadUrl, file);
  return presigned.publicUrl;
}

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
