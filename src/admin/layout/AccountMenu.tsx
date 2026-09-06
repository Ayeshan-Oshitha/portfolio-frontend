import { useEffect, useRef, useState } from "react";
import useAuth from "@/admin/context/useAuth";
import Badge from "@/admin/components/ui/Badge";
import {
  formatDate,
  initialsOf,
  roleLabel,
  statusLabel,
} from "@/admin/utils/format";

/**
 * The account avatar in the topbar — click to see role/status and sign-in
 * details. "View site" / "Sign out" are separate buttons next to it, not
 * folded in here.
 */
export default function AccountMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 transition-colors duration-150 hover:bg-primary-200"
      >
        {initialsOf(user.firstName, user.lastName, user.email)}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-xl border border-border-subtle bg-surface-900 p-3.5 shadow-panel">
          <p className="text-sm font-medium text-text-primary truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-text-muted truncate">{user.email}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge tone="brand">{roleLabel(user.role)}</Badge>
            <Badge variant="outline">{statusLabel(user.status)}</Badge>
          </div>

          <dl className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-text-secondary">Member since</dt>
              <dd className="text-text-primary">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-text-secondary">Last sign-in</dt>
              <dd className="text-text-primary">
                {formatDate(user.lastLoginAt)}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
