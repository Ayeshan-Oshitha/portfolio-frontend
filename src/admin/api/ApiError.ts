import type { ApiProblem } from "@/admin/types";

/**
 * Thrown for any non-2xx API response. The backend's `detail` messages are
 * already user-facing, so callers can surface `message` directly.
 */
export default class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly problem?: ApiProblem;

  constructor(status: number, message: string, problem?: ApiProblem) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = problem?.code;
    this.problem = problem;
  }

  /** True when the stored token is missing, malformed or expired. */
  get isAuthExpired(): boolean {
    return (
      this.status === 401 &&
      (this.code === "invalid_token" || this.code === "unauthenticated")
    );
  }
}

/** Network failures and unexpected throws reach the UI as a readable string. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
