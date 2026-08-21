import { createContext } from "react";

export type ToastVariant = "success" | "error" | "info";

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
}

export const ToastContext = createContext<ToastContextValue | null>(null);
