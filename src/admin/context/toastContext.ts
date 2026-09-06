import { createContext } from "react";

export type ToastVariant = "success" | "error" | "info" | "loading";

export interface ToastItem {
  readonly id: number;
  readonly variant: ToastVariant;
  readonly message: string;
}

export interface ToastContextValue {
  readonly toasts: readonly ToastItem[];
  readonly dismiss: (id: number) => void;
  readonly success: (message: string) => void;
  readonly error: (message: string) => void;
  readonly info: (message: string) => void;
  /** Sticks around (no auto-dismiss) until `dismiss(id)` is called — pair with a spinner-style action. */
  readonly loading: (message: string) => number;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
