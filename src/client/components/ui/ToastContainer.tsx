import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ToastItem, ToastVariant } from "@/client/context/toastContext";

interface ToastContainerProps {
  readonly toasts: readonly ToastItem[];
  readonly onDismiss: (id: number) => void;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  error: "bg-surface-900 text-danger-400 border-danger-500/40",
  success: "bg-surface-900 text-success-400 border-success-500/40",
  info: "bg-surface-900 text-text-primary border-border-default",
};

export default function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.variant === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${VARIANT_CLASSES[toast.variant]}`}
        >
          <p className="flex-1 min-w-0">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 -mr-1 -mt-0.5 p-1 rounded text-current opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}
