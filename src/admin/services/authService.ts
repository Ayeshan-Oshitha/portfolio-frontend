import type {
  AdminUser,
  AuthResponse,
  ChangePasswordRequest,
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
