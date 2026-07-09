import { Link } from "react-router-dom";
import { FOOTER_DATA } from "../../data/footer";
import { SOCIAL_LINKS } from "../../data/navigation";
import Logo from "../header/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Logo />
            <div className="flex flex-col gap-1 text-sm text-text-secondary mt-2">
              {FOOTER_DATA.addressLines.map((line, idx) => (
                <span key={idx}>{line}</span>
              ))}
            </div>
            <a
              href={`mailto:${FOOTER_DATA.email}`}
              className="text-sm font-medium text-text-primary hover:text-primary-400 transition-colors duration-200"
            >
              {FOOTER_DATA.email}
            </a>
            <p className="text-sm text-text-muted mt-2 max-w-xs">
              {FOOTER_DATA.serviceArea}
            </p>
          </div>

          {/* Link Groups */}
          {FOOTER_DATA.linkGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-6">
              <h4 className="text-xs font-bold tracking-widest uppercase text-text-primary">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-4">
                {group.links.map((link) => {
                  const linkClasses = `text-sm transition-colors duration-200 ${
                    link.isAccent
                      ? "text-primary-400 font-medium hover:text-primary-300"
                      : "text-text-secondary hover:text-text-primary"
                  }`;
                  
                  if (link.href.startsWith("http") || link.href === "#") {
                    return (
                      <li key={link.label}>
                        <a href={link.href} className={linkClasses}>
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={link.label}>
                      <Link to={link.href} className={linkClasses}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border-subtle">
          <p className="text-xs text-text-muted">
            {FOOTER_DATA.copyright}
          </p>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.platform}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="text-text-muted hover:text-text-primary transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              );
            })}
            {/* BBB Placeholder */}
            <span className="text-xs font-bold tracking-widest text-text-muted ml-2">
              BBB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
