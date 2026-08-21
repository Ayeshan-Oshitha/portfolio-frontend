import type {
  AdminUser,
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "@/admin/types";
import { request } from "@/admin/api/client";

export function register(payload: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>("/admin/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export function login(payload: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>("/admin/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

/** Note: this returns the user object flat, unlike login/register. */
export function getMe(signal?: AbortSignal): Promise<AdminUser> {
  return request<AdminUser>("/admin/auth/me", { signal });
}

/** Answers 204 with an empty body. */
export function changePassword(payload: ChangePasswordRequest): Promise<void> {
  return request<void>("/admin/auth/change-password", {
    method: "POST",
    body: payload,
  });
}
