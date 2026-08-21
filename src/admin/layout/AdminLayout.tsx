import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CreditCard,
  FolderKanban,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Tags,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import Button from "@/portfolio/components/ui/Button";
import useAuth from "@/admin/context/useAuth";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users, end: false },
  {
    to: "/admin/approvals",
    label: "Approvals",
    icon: UserCheck,
    end: false,
  },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, end: false },
  { to: "/admin/articles", label: "Articles", icon: Newspaper, end: false },
  { to: "/admin/tags", label: "Tags", icon: Tags, end: false },
  { to: "/admin/services", label: "Services", icon: Wrench, end: false },
  { to: "/admin/pricing", label: "Pricing", icon: CreditCard, end: false },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, end: false },
  {
    to: "/admin/change-password",
    label: "Change password",
    icon: KeyRound,
    end: false,
  },
] as const;

const LINK_BASE =
  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border-subtle bg-surface-900/40 p-6 flex flex-col gap-8">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary-400">
            Portfolio CMS
          </p>
          {user && (
            <p className="mt-2 text-sm text-text-secondary truncate">
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${LINK_BASE} ${
                  isActive
                    ? "bg-primary-600/10 text-primary-400"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-800"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

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
      </aside>

      <main className="flex-1 p-6 md:p-10 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
