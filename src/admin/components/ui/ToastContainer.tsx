import { X } from "lucide-react";
import AdminPortal from "@/admin/layout/AdminPortal";
import type { ToastItem, ToastVariant } from "@/admin/context/toastContext";

interface ToastContainerProps {
  readonly toasts: readonly ToastItem[];
  readonly onDismiss: (id: number) => void;
}

/* A left accent rule carries the severity, matching `Alert` — the two are the
   same message at different urgencies and should read as one system. */
const VARIANT_CLASSES: Record<ToastVariant, string> = {
  error: "text-danger-500 border-border-subtle border-l-danger-500",
  success: "text-success-500 border-border-subtle border-l-success-500",
  info: "text-text-primary border-border-subtle border-l-accent-500",
};

/**
 * Stacked toast notifications, rendered above the modal layer (`z-50`)
 * through `AdminPortal` so the admin theme follows them out of `AdminRoot`.
 */
export default function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <AdminPortal>
      <div className="fixed bottom-4 right-4 z-60 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.variant === "error" ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-lg bg-surface-900 border border-l-2 px-4 py-3 text-sm shadow-panel motion-safe:animate-slide-in-right ${VARIANT_CLASSES[toast.variant]}`}
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
      </div>
    </AdminPortal>
  );
}
