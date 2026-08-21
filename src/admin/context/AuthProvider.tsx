import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AdminUser,
  AuthStatus,
  LoginRequest,
  RegisterRequest,
} from "@/admin/types";
import * as authService from "@/admin/services/authService";
import { AUTH_EXPIRED_EVENT } from "@/admin/services/httpClient";
import { useLogin, useRegister } from "@/admin/hooks/useAuthApi";
import {
  clearStoredToken,
  getStoredToken,
  isExpired,
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
  // "loading" means there is a token worth verifying against /auth/me.
  const [status, setStatus] = useState<AuthStatus>(() => {
    const stored = getStoredToken();
    if (!stored || isExpired(stored)) {
      clearStoredToken();
      return "unauthenticated";
    }
    return "loading";
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const logout = useCallback(() => {
    // No logout endpoint exists — dropping the token is the whole operation.
    clearStoredToken();
    setUser(null);
    setStatus("unauthenticated");
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

  // The client broadcasts this when the API rejects our token mid-session.
  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, logout);
  }, [logout]);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const response = await loginMutation.mutateAsync(payload);
      setStoredToken({
        accessToken: response.accessToken,
        expiresAt: response.expiresAt,
      });
      setUser(response.user);
      setStatus("authenticated");
      return response.user;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const response = await registerMutation.mutateAsync(payload);
      setStoredToken({
        accessToken: response.accessToken,
        expiresAt: response.expiresAt,
      });
      setUser(response.user);
      setStatus("authenticated");
      return response.user;
    },
    [registerMutation],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
