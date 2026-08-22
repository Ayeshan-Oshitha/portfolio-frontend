import axios from "axios";
import ApiError from "@/client/services/ApiError";
import type { ApiProblem } from "@/client/types";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7060/api"
).replace(/\/$/, "");

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
});

httpClient.interceptors.response.use(
  (response) => response,
  (cause: unknown) => {
    if (axios.isCancel(cause)) throw cause;

    if (!axios.isAxiosError(cause)) throw cause;

    if (!cause.response) {
      throw new ApiError(
        0,
        "Could not reach the server. Please check your connection and try again.",
      );
    }

    const problem = cause.response.data as ApiProblem | undefined;
    throw new ApiError(
      cause.response.status,
      problem?.detail ??
        problem?.title ??
        cause.response.statusText ??
        "Request failed.",
      problem,
    );
  },
);
