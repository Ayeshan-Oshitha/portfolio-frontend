import axios, { type InternalAxiosRequestConfig } from "axios";
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

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Skip attaching the bearer token. Defaults to false — nearly all routes need it. */
    skipAuth?: boolean;
  }
}

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.skipAuth) {
    const token = getActiveAccessToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (cause: unknown) => {
    if (axios.isCancel(cause)) throw cause;

    if (!axios.isAxiosError(cause)) throw cause;

    if (!cause.response) {
      throw new ApiError(
        0,
        "Could not reach the server. Check that the API is running.",
      );
    }

    const problem = cause.response.data as ApiProblem | undefined;
    const error = new ApiError(
      cause.response.status,
      problem?.detail ??
        problem?.title ??
        cause.response.statusText ??
        "Request failed.",
      problem,
    );

    if (error.isAuthExpired) {
      clearStoredToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    throw error;
  },
);
