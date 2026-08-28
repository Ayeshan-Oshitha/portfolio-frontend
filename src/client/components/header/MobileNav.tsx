import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/client/data/navigation";
import Button from "@/client/components/ui/Button";
import ThemeSwitcher from "@/client/components/ui/ThemeSwitcher";
import Logo from "./Logo";

interface MobileNavProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in bg-surface-950 lg:hidden">
      <div className="flex h-20.5 items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-raise-br bg-raise text-text-secondary transition-colors duration-200 hover:text-text-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav
        className="flex h-full flex-col overflow-y-auto px-6 pb-8"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-lg font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-raise text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="my-6 h-px bg-hair" aria-hidden="true" />

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
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-raise-br bg-raise text-text-muted transition-colors duration-200 hover:text-text-primary"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        <div className="mt-8 px-4">
          <Button href="/contact" size="lg" className="w-full">
            Contact Us
          </Button>
        </div>
      </nav>
    </div>
  );
}
