import { NAV_ITEMS, SOCIAL_LINKS } from "../../data/navigation";
import Button from "../ui/Button";

export default function DesktopNav() {
  return (
    <div className="hidden lg:flex items-center gap-1">
      {/* Main nav links */}
      <nav className="flex items-center gap-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-lg hover:bg-surface-800/50"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle mx-3" aria-hidden="true" />

      {/* Social icons */}
      <div className="flex items-center gap-1">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800/50 transition-all duration-200"
            >
              <Icon size={16} />
            </a>
          );
        })}
      </div>

      {/* CTA */}
      <Button href="#contact" size="sm" className="ml-3 uppercase tracking-wider text-xs">
        Get a Free Quote
      </Button>
    </div>
  );
}
