import axios from "axios";
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

const GENERIC_SERVER_ERROR =
  "Something went wrong on our end. Please try again in a moment.";
const GENERIC_CONNECTION_ERROR =
  "Could not reach the server. Please check your connection and try again.";
const GENERIC_REQUEST_ERROR = "That request couldn't be completed. Please try again.";

/** Network failures and unexpected throws reach the UI as a readable string; technical detail goes to the console. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      console.error("Network error:", error);
      return GENERIC_CONNECTION_ERROR;
    }
    if (error.status >= 500) {
      console.error(`Server error (${error.status}):`, error.problem, error);
      return GENERIC_SERVER_ERROR;
    }
    if (error.problem?.detail || error.problem?.title) return error.message;
    console.error(`Request error (${error.status}):`, error);
    return GENERIC_REQUEST_ERROR;
  }

  if (axios.isAxiosError(error)) {
    console.error("Request failed:", error);
    if (!error.response) return GENERIC_CONNECTION_ERROR;
    if (error.response.status >= 500) return GENERIC_SERVER_ERROR;
    return GENERIC_REQUEST_ERROR;
  }

  if (error instanceof Error) {
    console.error(error);
    return "Something went wrong. Please try again.";
  }

  console.error(error);
  return "Something went wrong. Please try again.";
}
