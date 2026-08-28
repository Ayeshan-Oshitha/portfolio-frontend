import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/client/data/navigation";

export default function DesktopNav() {
  return (
    <nav
      className="hidden flex-1 items-center justify-center gap-1 lg:flex"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/"}
          className={({ isActive }) =>
            `rounded-lg px-3.5 py-2 text-[14.5px] transition-colors duration-200 ${
              isActive
                ? "font-bold text-text-primary"
                : "font-medium text-text-secondary hover:text-text-primary"
            }`
          }
        >
          {({ isActive }) => (
            <span className="relative inline-block">
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-primary-400"
                />
              )}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
