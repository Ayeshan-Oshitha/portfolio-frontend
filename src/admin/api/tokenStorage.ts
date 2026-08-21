import type { StoredToken } from "@/admin/types";

const STORAGE_KEY = "portfolio_admin_auth";

/**
 * The API validates lifetimes with ClockSkew = Zero, so a token that is
 * within this window of expiring is already useless in practice.
 */
const EXPIRY_LEEWAY_MS = 30_000;

export function getStoredToken(): StoredToken | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredToken>;
    if (!parsed?.accessToken || !parsed?.expiresAt) {
      clearStoredToken();
      return null;
    }

    return { accessToken: parsed.accessToken, expiresAt: parsed.expiresAt };
  } catch {
    clearStoredToken();
    return null;
  }
}

export function setStoredToken(token: StoredToken): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(token));
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isExpired(token: StoredToken): boolean {
  const expiresAt = Date.parse(token.expiresAt);
  if (Number.isNaN(expiresAt)) return true;
  return expiresAt - EXPIRY_LEEWAY_MS <= Date.now();
}

/** The bearer token to send, or null when there is no usable session. */
export function getActiveAccessToken(): string | null {
  const token = getStoredToken();
  if (!token) return null;
  if (isExpired(token)) {
    clearStoredToken();
    return null;
  }
  return token.accessToken;
}
