import axios from "axios";
import type {
  MediaConfigResponse,
  PresignedUploadRequest,
  PresignedUploadResponse,
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
  onProgress?: (percent: number) => void,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: onProgress
      ? (event) => {
          if (event.total) onProgress(Math.round((event.loaded / event.total) * 100));
        }
      : undefined,
  });
}

/**
 * Uploads a file and resolves to a `media://` token identifying it — not the
 * resolved URL. Storing the token (rather than the long real URL) keeps
 * markdown short and readable, and lets storage move without rewriting every
 * article; `resolveMediaDisplayUrl` (in `utils/markdownImages.ts`) turns it
 * back into something an `<img>` can load, using `getMediaConfig` below.
 */
export async function uploadImage(
  request: PresignedUploadRequest,
  file: File,
): Promise<string> {
  const presigned = await createPresignedUpload(request);
  await uploadToPresignedUrl(presigned.uploadUrl, file);
  return `media://${presigned.objectKey}`;
}

/**
 * The base URL a `media://` token's prefix is swapped for to become loadable.
 * Fetched once and cached — see `useMediaConfig` — rather than resolved
 * per-image server-side.
 */
export async function getMediaConfig(): Promise<MediaConfigResponse> {
  const { data } = await httpClient.get<MediaConfigResponse>(
    "/admin/media/config",
  );
  return data;
}
