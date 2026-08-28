import { Link } from "react-router-dom";
import ThemeSwitcher from "@/client/components/ui/ThemeSwitcher";

export default function HeaderActions() {
  return (
    // The switcher sits outside the `lg:` gate on purpose, so the toggle stays
    // reachable from the collapsed header without opening the mobile menu.
    // Below `lg` the nav and this CTA give way to the hamburger.
    <div className="flex shrink-0 items-center gap-3">
      <ThemeSwitcher />

      <Link
        to="/contact"
        className="hidden lg:inline-flex items-center rounded-xl fw-btn px-5 py-2.5 text-sm font-bold shadow-btn transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
      >
        Contact Us
      </Link>
    </div>
  );
}
