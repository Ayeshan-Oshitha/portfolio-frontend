import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/client/data/navigation";
import Button from "@/client/components/ui/Button";
import Logo from "./Logo";

interface MobileNavProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-[#1f202c]/98 backdrop-blur-xl animate-fade-in">
      {/* Top bar with close button — mirrors the floating header height */}
      <div className="flex items-center justify-between h-[92px] px-6">
        <div onClick={onClose}>
          <Logo />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <nav
        className="flex flex-col px-6 pb-8 h-full overflow-y-auto"
        aria-label="Mobile navigation"
      >
        {/* Nav links */}
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, index) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `px-4 py-2 text-lg font-semibold rounded-xl transition-colors duration-200 hover:bg-white/5 ${
                  isActive
                    ? "text-primary-400"
                    : "text-white/70 hover:text-white"
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-6" aria-hidden="true" />

        {/* Social links */}
        <div className="flex items-center gap-3 px-4">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="flex items-center justify-center w-11 h-11 rounded-xl text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 px-4">
          <Button
            href="/contact"
            size="lg"
            className="w-full uppercase tracking-wider text-xs"
          >
            Get a Free Quote
          </Button>
        </div>
      </nav>
    </div>
  );
}
