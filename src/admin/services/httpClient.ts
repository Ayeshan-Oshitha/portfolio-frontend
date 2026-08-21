import axios, { type InternalAxiosRequestConfig } from "axios";
import type { ApiProblem, AuthResponse } from "@/admin/types";
import ApiError from "@/admin/api/ApiError";
import {
  clearStoredToken,
  getActiveAccessToken,
  getStoredToken,
  isRefreshExpired,
  setStoredToken,
} from "@/admin/api/tokenStorage";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7060/api"
).replace(/\/$/, "");

/**
 * Broadcast when the API rejects our token and a refresh either isn't
 * possible or also failed. The auth context listens for this so a dead
 * session drops the user back to the login screen from anywhere.
 */
export const AUTH_EXPIRED_EVENT = "portfolio-admin:auth-expired";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Skip attaching the bearer token. Defaults to false — nearly all routes need it. */
    skipAuth?: boolean;
    /** Marks a request that already went through one refresh-and-retry cycle. */
    _retry?: boolean;
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

// Shared across concurrent 401s so a burst of requests triggers one refresh
// call, not one per request. A bare `axios.post` (not `httpClient`) so this
// doesn't recurse through the response interceptor below.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const stored = getStoredToken();
  if (!stored || isRefreshExpired(stored)) return null;

  try {
    const { data } = await axios.post<AuthResponse>(
      `${BASE_URL}/admin/auth/refresh`,
      { refreshToken: stored.refreshToken },
      { headers: { Accept: "application/json" } },
    );
    setStoredToken({
      accessToken: data.accessToken,
      expiresAt: data.expiresAt,
      refreshToken: data.refreshToken,
      refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    });
    return data.accessToken;
  } catch {
    return null;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (cause: unknown) => {
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

    if (error.isAuthExpired && cause.config && !cause.config._retry) {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        cause.config._retry = true;
        cause.config.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return httpClient(cause.config);
      }
    }

    if (error.isAuthExpired) {
      clearStoredToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    throw error;
  },
);
