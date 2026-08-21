import type {
  AdminUser,
  AuthResponse,
  ChangePasswordRequest,
  GoogleSignInRequest,
  LoginRequest,
  RegisterRequest,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>(
    "/admin/auth/register",
    payload,
    { skipAuth: true },
  );
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>(
    "/admin/auth/login",
    payload,
    { skipAuth: true },
  );
  return data;
}

export async function googleSignIn(
  payload: GoogleSignInRequest,
): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>(
    "/admin/auth/google",
    payload,
    { skipAuth: true },
  );
  return data;
}

/**
 * Not used by `httpClient`'s own refresh interceptor — that calls the endpoint
 * directly to avoid recursing through this module's dependency on `httpClient`.
 * Exposed here for `AuthProvider` and anywhere else that wants an explicit
 * refresh without going through a 401.
 */
export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>(
    "/admin/auth/refresh",
    { refreshToken },
    { skipAuth: true },
  );
  return data;
}

/** Revokes the refresh token server-side. Answers 204. Best-effort on logout. */
export async function logout(refreshToken: string): Promise<void> {
  await httpClient.post(
    "/admin/auth/logout",
    { refreshToken },
    { skipAuth: true },
  );
}

/** Note: this returns the user object flat, unlike login/register. */
export async function getMe(signal?: AbortSignal): Promise<AdminUser> {
  const { data } = await httpClient.get<AdminUser>("/admin/auth/me", {
    signal,
  });
  return data;
}

/** Answers 204 with an empty body. */
export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<void> {
  await httpClient.post("/admin/auth/change-password", payload);
}
