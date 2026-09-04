import type {
  AdminUser,
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleSignInRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResendVerificationResponse,
  SetPasswordRequest,
  VerifyEmailRequest,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

/**
 * Creates an `email_verification_required` account and emails a verification
 * link. Deliberately returns no token — verification then super admin
 * approval are both required before sign-in works.
 */
export async function register(payload: RegisterRequest): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    "/admin/auth/register",
    payload,
    { skipAuth: true },
  );
  return data;
}

/** Moves a password account from `email_verification_required` to `pending`. Never issues a sign-in token. */
export async function verifyEmail(
  payload: VerifyEmailRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    "/admin/auth/verify-email",
    payload,
    { skipAuth: true },
  );
  return data;
}

/** Always resolves to the same generic message, whatever the email resolves to. Answers 202. */
export async function resendVerification(
  payload: ResendVerificationRequest,
): Promise<ResendVerificationResponse> {
  const { data } = await httpClient.post<ResendVerificationResponse>(
    "/admin/auth/resend-verification",
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

/** Always resolves to the same generic message, whatever the email resolves to. Answers 200. */
export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const { data } = await httpClient.post<ForgotPasswordResponse>(
    "/admin/auth/forgot-password",
    payload,
    { skipAuth: true },
  );
  return data;
}

/**
 * Redeems a password-reset or account-setup token. Never issues a sign-in
 * token, and revokes all of the user's existing refresh tokens server-side.
 */
export async function setPassword(
  payload: SetPasswordRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    "/admin/auth/set-password",
    payload,
    { skipAuth: true },
  );
  return data;
}
