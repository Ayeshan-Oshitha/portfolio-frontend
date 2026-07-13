import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/portfolio/data/navigation";

export default function DesktopNav() {
  return (
    <nav
      className="hidden md:flex flex-1 items-center md:justify-end lg:justify-center gap-1"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/"}
          className={({ isActive }) =>
            `px-3 py-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-200 rounded-lg hover:bg-white/5 ${
              isActive
                ? "text-primary-400 underline underline-offset-4 decoration-2 decoration-primary-400"
                : "text-white/60 hover:text-white"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
