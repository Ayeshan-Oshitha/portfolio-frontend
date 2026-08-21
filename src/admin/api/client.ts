import type { ApiProblem } from "@/admin/types";
import ApiError from "@/admin/api/ApiError";
import {
  clearStoredToken,
  getActiveAccessToken,
} from "@/admin/api/tokenStorage";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7060/api"
).replace(/\/$/, "");

/**
 * Broadcast when the API rejects our token. The auth context listens for this
 * so an expired session drops the user back to the login screen from anywhere.
 * There is no refresh endpoint, so re-authenticating is the only recovery.
 */
export const AUTH_EXPIRED_EVENT = "portfolio-admin:auth-expired";

interface RequestOptions {
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly body?: unknown;
  /** Attach the bearer token. Defaults to true — nearly all routes need it. */
  readonly auth?: boolean;
  readonly query?: Record<string, string | number | boolean | undefined>;
  readonly signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }

  const search = params.toString();
  return search ? `${url}?${search}` : url;
}

async function readProblem(
  response: Response,
): Promise<ApiProblem | undefined> {
  try {
    const text = await response.text();
    if (!text) return undefined;
    return JSON.parse(text) as ApiProblem;
  } catch {
    return undefined;
  }
}

/**
 * Returns the parsed JSON body, or `undefined` for 204 responses — the API
 * answers change-password and delete with an empty body.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true, query, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getActiveAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new ApiError(
      0,
      "Could not reach the server. Check that the API is running.",
    );
  }

  if (!response.ok) {
    const problem = await readProblem(response);
    const error = new ApiError(
      response.status,
      problem?.detail ??
        problem?.title ??
        response.statusText ??
        "Request failed.",
      problem,
    );

    if (error.isAuthExpired) {
      clearStoredToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    throw error;
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
