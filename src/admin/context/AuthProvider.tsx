import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AdminUser,
  AuthResponse,
  AuthStatus,
  LoginRequest,
  RegisterRequest,
} from "@/admin/types";
import * as authService from "@/admin/services/authService";
import { isCanceled } from "@/admin/api/ApiError";
import { AUTH_EXPIRED_EVENT } from "@/admin/services/httpClient";
import {
  useGoogleSignIn,
  useLogin,
  useRegister,
} from "@/admin/hooks/useAuthApi";
import { clearAccessToken, setAccessToken } from "@/admin/api/tokenStorage";
import {
  AuthContext,
  type AuthContextValue,
} from "@/admin/context/authContext";

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  // There's no client-visible refresh token to inspect anymore (it's an httpOnly cookie), so
  // every mount starts "loading" and asks /auth/me — a cold access token 401s, httpClient's
  // interceptor silently refreshes from the cookie and retries, and that either lands on
  // "authenticated" or, if the cookie is gone/expired too, cleanly on "unauthenticated".
  const [status, setStatus] = useState<AuthStatus>("loading");

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleSignInMutation = useGoogleSignIn();

  const logout = useCallback(async () => {
    clearAccessToken();
    setUser(null);
    setStatus("unauthenticated");

    // Best-effort: revokes the refresh-token cookie server-side, but the local
    // session is already gone regardless of whether this succeeds.
    authService.logout().catch(() => {});
  }, []);

  // Rehydrate the session on mount via the refresh-token cookie.
  useEffect(() => {
    if (status !== "loading") return;

    const controller = new AbortController();

    authService
      .getMe(controller.signal)
      .then((me) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch((error: unknown) => {
        if (isCanceled(error)) return;
        // Storage is the interceptor's to clear on a real auth failure — a network blip
        // shouldn't cost the user a still-valid refresh token.
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => controller.abort();
    // Runs once: status only leaves "loading" and never returns to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The client broadcasts this when the API rejects our token mid-session
  // and a refresh either wasn't possible or also failed.
  useEffect(() => {
    function handleAuthExpired() {
      setUser(null);
      setStatus("unauthenticated");
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  function storeSession(response: AuthResponse) {
    setAccessToken({ accessToken: response.accessToken, expiresAt: response.expiresAt });
    setUser(response.user);
    setStatus("authenticated");
  }

  const login = useCallback(
    async (payload: LoginRequest) => {
      const response = await loginMutation.mutateAsync(payload);
      storeSession(response);
      return response.user;
    },
    [loginMutation],
  );

  // No token is issued here — the account still needs email verification and
  // super admin approval before it can sign in.
  const register = useCallback(
    (payload: RegisterRequest) => registerMutation.mutateAsync(payload),
    [registerMutation],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const response = await googleSignInMutation.mutateAsync({ idToken });
      storeSession(response);
      return response.user;
    },
    [googleSignInMutation],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, loginWithGoogle, logout }),
    [user, status, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
