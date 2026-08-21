import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CreditCard,
  FolderKanban,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Newspaper,
  Tags,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import Button from "@/admin/components/ui/Button";
import useAuth from "@/admin/context/useAuth";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "People",
    items: [
      {
        to: "/admin/users",
        label: "Users",
        icon: Users,
        end: false,
        superAdminOnly: true,
      },
      {
        to: "/admin/approvals",
        label: "Approvals",
        icon: UserCheck,
        end: false,
        superAdminOnly: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/projects", label: "Projects", icon: FolderKanban, end: false },
      { to: "/admin/articles", label: "Articles", icon: Newspaper, end: false },
      { to: "/admin/tags", label: "Tags", icon: Tags, end: false },
      { to: "/admin/services", label: "Services", icon: Wrench, end: false },
      { to: "/admin/pricing", label: "Pricing", icon: CreditCard, end: false },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, end: false },
      {
        to: "/admin/reviews",
        label: "Reviews",
        icon: MessageSquareQuote,
        end: false,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/admin/change-password",
        label: "Change password",
        icon: KeyRound,
        end: false,
      },
    ],
  },
] as const;

const GROUP_LABEL_CLASSES =
  "px-4 mb-1 text-[10px] font-semibold tracking-widest uppercase text-text-muted";

const LINK_BASE =
  "flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-lg border-l-2 text-sm font-medium transition-colors duration-200";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    void logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border-subtle bg-surface-900/40 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold">
            P
          </span>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-text-primary">
            Portfolio CMS
          </p>
        </div>

        <nav className="flex flex-col gap-6 flex-1">
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter(
              (item) =>
                !("superAdminOnly" in item && item.superAdminOnly) ||
                user?.role === "super_admin",
            );
            if (items.length === 0) return null;

            return (
              <div key={group.label}>
                <p className={GROUP_LABEL_CLASSES}>{group.label}</p>
                <div className="flex flex-col gap-1">
                  {items.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        `${LINK_BASE} ${
                          isActive
                            ? "border-primary-500 bg-primary-600/10 text-primary-400"
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

        <div className="flex flex-col gap-3">
          {user && (
            <div className="rounded-xl bg-surface-800/60 border border-border-subtle p-3">
              <p className="text-sm text-text-primary font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-text-muted truncate">{user.email}</p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="h-4 w-4" />}
            iconPosition="left"
            className="justify-start"
          >
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
