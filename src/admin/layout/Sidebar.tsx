import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import useAuth from "@/admin/context/useAuth";
import IconButton from "@/admin/components/ui/IconButton";
import BrandMark from "./BrandMark";
import { NAV_GROUPS } from "./navigation";

interface SidebarProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

const GROUP_LABEL_CLASSES =
  "px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted";

const LINK_BASE =
  "flex items-center gap-3 pl-3 pr-3 py-2 rounded-lg border-l-2 text-sm font-medium transition-colors duration-150";

/** Two initials for the account tile, falling back to the email. */
function initialsOf(firstName?: string, lastName?: string, email?: string) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim();
  return (initials || email?.[0] || "?").toUpperCase();
}

/**
 * The CMS sidebar. Fixed on desktop and an off-canvas drawer below `md`.
 *
 * It used to be an in-flow flex column, which meant it scrolled away with
 * the page — on the longer editor screens the navigation was simply gone by
 * the time you reached the bottom. On mobile it stacked the entire nav above
 * every page's content.
 */
export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Navigating from the drawer should close it; without this the panel stays
  // over the page the user just asked for.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close on navigation only
  }, [pathname]);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-primary-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-68 flex-col bg-surface-900 border-r border-border-subtle transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 h-16 shrink-0 border-b border-border-subtle">
          <BrandMark />
          <div className="md:hidden">
            <IconButton
              icon={<X className="h-4 w-4" />}
              label="Close navigation"
              onClick={onClose}
            />
          </div>
        </div>

        <nav className="modal-scroll flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-6">
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter(
              (item) => !item.superAdminOnly || user?.role === "super_admin",
            );
            if (items.length === 0) return null;

            return (
              <div key={group.label}>
                <p className={GROUP_LABEL_CLASSES}>{group.label}</p>
                <div className="flex flex-col gap-0.5">
                  {items.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        `${LINK_BASE} ${
                          isActive
                            ? "border-primary-600 bg-primary-50 text-primary-700"
                            : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-800"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {user && (
          <div className="shrink-0 border-t border-border-subtle p-3">
            <div className="flex items-center gap-3 rounded-xl bg-surface-800 border border-border-subtle p-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                {initialsOf(user.firstName, user.lastName, user.email)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-text-muted truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
