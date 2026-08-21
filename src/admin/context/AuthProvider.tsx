import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AdminUser,
  AuthResponse,
  AuthStatus,
  LoginRequest,
  RegisterRequest,
} from "@/admin/types";
import * as authService from "@/admin/services/authService";
import { AUTH_EXPIRED_EVENT } from "@/admin/services/httpClient";
import { useGoogleSignIn, useLogin, useRegister } from "@/admin/hooks/useAuthApi";
import {
  clearStoredToken,
  getStoredToken,
  isRefreshExpired,
  setStoredToken,
} from "@/admin/api/tokenStorage";
import {
  AuthContext,
  type AuthContextValue,
} from "@/admin/context/authContext";

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  // Decided up front so the effect never has to setState synchronously:
  // "loading" means there is a token worth verifying against /auth/me — an
  // expired access token is fine here too, since `httpClient`'s interceptor
  // transparently refreshes it as long as the refresh token is still good.
  const [status, setStatus] = useState<AuthStatus>(() => {
    const stored = getStoredToken();
    if (!stored || isRefreshExpired(stored)) {
      clearStoredToken();
      return "unauthenticated";
    }
    return "loading";
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleSignInMutation = useGoogleSignIn();

  const logout = useCallback(async () => {
    const stored = getStoredToken();
    clearStoredToken();
    setUser(null);
    setStatus("unauthenticated");

    if (stored && !isRefreshExpired(stored)) {
      // Best-effort: revokes the refresh token server-side, but the local
      // session is already gone regardless of whether this succeeds.
      authService.logout(stored.refreshToken).catch(() => {});
    }
  }, []);

  // Rehydrate the session from localStorage on mount.
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
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        clearStoredToken();
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
    setStoredToken({
      accessToken: response.accessToken,
      expiresAt: response.expiresAt,
      refreshToken: response.refreshToken,
      refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    });
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

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const response = await registerMutation.mutateAsync(payload);
      storeSession(response);
      return response.user;
    },
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
