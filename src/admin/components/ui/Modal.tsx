import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import AdminPortal from "@/admin/layout/AdminPortal";

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
  /** Rendered right-aligned under a divider — usually the action buttons. */
  readonly footer?: React.ReactNode;
  readonly size?: ModalSize;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  xs: "max-w-sm",
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * The admin panel's dialog primitive. Rendered through `AdminPortal` so it
 * escapes the layout's stacking and overflow contexts while keeping the
 * admin theme attached to the portalled subtree.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Ref avoids re-running the setup effect below when callers pass a fresh inline onClose.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Escape closes; focus moves to the panel on open and back to the trigger on close.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  // The backdrop is tinted with the darkest brand stop rather than a surface
  // token: every surface value is pale under the light theme, so none of them
  // dim the page behind the dialog.
  return (
    <AdminPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/30 backdrop-blur-md"
        onMouseDown={(event) => {
          // Only dismiss if the press started on the backdrop, not a drag-select ending outside the panel.
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={`modal-scroll w-full ${SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-900 border border-border-subtle shadow-panel focus:outline-none motion-safe:animate-[fade-in-up_0.18s_ease-out]`}
        >
          <div className="flex items-start gap-4 px-8 pt-8">
            <div className="flex-1 min-w-0">
              <h2
                id={titleId}
                className="admin-display text-2xl leading-snug text-text-primary truncate"
              >
                {title}
              </h2>
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1.5 text-sm text-text-secondary"
                >
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="shrink-0 -mr-2 -mt-1 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="px-8 py-6">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-border-subtle">
              {footer}
            </div>
          )}
        </div>
      </div>
    </AdminPortal>
  );
}
