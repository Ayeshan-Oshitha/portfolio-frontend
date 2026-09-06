import { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, ExternalLink, LogOut, Menu } from "lucide-react";
import useAuth from "@/admin/context/useAuth";
import Button from "@/admin/components/ui/Button";
import IconButton from "@/admin/components/ui/IconButton";
import AccountMenu from "./AccountMenu";
import { ROUTE_LABELS } from "./navigation";

interface TopbarProps {
  readonly onMenu: () => void;
}

interface Crumb {
  readonly label: string;
  readonly to: string;
}

/**
 * Builds the breadcrumb trail from the URL.
 *
 * Segments the CMS knows about get a friendly label; anything else — a record
 * id in `/admin/articles/:id` — is shown as "Edit" rather than exposing a raw
 * uuid in the chrome.
 */
function crumbsFor(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join("/")}`;
    const known = ROUTE_LABELS[segment];
    return { to, label: known ?? (index > 1 ? "Edit" : segment) };
  });
}

/**
 * Sticky header above the page content.
 *
 * Carries the mobile drawer trigger, breadcrumbs, a link out to the live
 * site, sign-out, and the account avatar (role/status, sign-in details).
 * There is deliberately no global search: the API has no cross-entity search
 * endpoint, and a search box that does nothing is worse than none.
 */
export default function Topbar({ onMenu }: TopbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const crumbs = crumbsFor(pathname);

  function handleLogout() {
    void logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-950/85 backdrop-blur-md px-5 md:px-10">
      <div className="md:hidden">
        <IconButton
          icon={<Menu className="h-5 w-5" />}
          label="Open navigation"
          onClick={onMenu}
        />
      </div>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <Fragment key={crumb.to}>
                {index > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-text-muted"
                    aria-hidden="true"
                  />
                )}
                <li className="min-w-0">
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="block truncate font-semibold text-text-primary"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.to}
                      className="block truncate text-text-muted hover:text-text-primary transition-colors duration-150"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          href="/"
          icon={<ExternalLink className="h-4 w-4" />}
          className="hidden sm:inline-flex"
        >
          View site
        </Button>

        <IconButton
          icon={<LogOut className="h-4 w-4" />}
          label="Sign out"
          onClick={handleLogout}
        />

        <div className="ml-1">
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
