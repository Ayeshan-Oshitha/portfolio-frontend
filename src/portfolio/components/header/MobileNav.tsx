import { NAV_ITEMS, SOCIAL_LINKS } from "../../data/navigation";
import Button from "../ui/Button";

interface MobileNavProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 top-[73px] z-40 bg-surface-950/98 backdrop-blur-xl animate-fade-in">
      <nav
        className="flex flex-col px-6 py-8 h-full"
        aria-label="Mobile navigation"
      >
        {/* Nav links */}
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="px-4 py-3 text-lg font-medium text-text-secondary hover:text-text-primary hover:bg-surface-800/50 rounded-xl transition-colors duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border-subtle my-6" aria-hidden="true" />

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
                className="flex items-center justify-center w-11 h-11 rounded-xl text-text-muted hover:text-text-primary bg-surface-800/50 hover:bg-surface-700 transition-all duration-200"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 px-4">
          <Button
            href="#contact"
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
