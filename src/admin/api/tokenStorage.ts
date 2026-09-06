/**
 * The refresh token never reaches the frontend — it's an httpOnly cookie the browser manages on
 * its own. The access token lives only here, in memory: nothing persists it, so it's gone on
 * every reload by design, and `httpClient`'s 401-refresh cycle re-fetches one from the cookie.
 */

interface AccessToken {
  readonly accessToken: string;
  readonly expiresAt: string;
}

/**
 * The API validates lifetimes with ClockSkew = Zero, so a token that is
 * within this window of expiring is already useless in practice.
 */
const EXPIRY_LEEWAY_MS = 30_000;

let current: AccessToken | null = null;

export function setAccessToken(token: AccessToken): void {
  current = token;
}

export function clearAccessToken(): void {
  current = null;
}

/** The bearer token to send, or null when there is no usable one in memory. */
export function getActiveAccessToken(): string | null {
  if (!current) return null;

  const expiresAt = Date.parse(current.expiresAt);
  if (Number.isNaN(expiresAt) || expiresAt - EXPIRY_LEEWAY_MS <= Date.now()) {
    return null;
  }

  return current.accessToken;
}
