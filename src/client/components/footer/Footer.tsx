import { Link } from "react-router-dom";
import { FOOTER_DATA } from "@/client/data/footer";
import { SOCIAL_LINKS } from "@/client/data/navigation";
import Logo from "../header/Logo";

function FooterLink({ href, label }: { href: string; label: string }) {
  const classes =
    "text-sm text-text-muted transition-colors duration-200 hover:text-text-primary";

  if (href.startsWith("http") || href === "#") {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  }
  return (
    <Link to={href} className={classes}>
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-hair pt-13">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3.5">
            <Logo size="sm" />
            <p className="max-w-60 text-sm leading-relaxed text-text-muted">
              {FOOTER_DATA.blurb}
            </p>
            <a
              href={`mailto:${FOOTER_DATA.email}`}
              className="text-sm font-semibold text-accent-400 transition-colors duration-200 hover:text-accent-500"
            >
              {FOOTER_DATA.email}
            </a>

            <div className="mt-1 flex gap-2.5">
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-card-br bg-card text-text-muted transition-colors duration-200 hover:text-text-primary"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_DATA.linkGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h4 className="text-[12.5px] font-bold tracking-[0.1em] text-text-primary">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-col-reverse items-center justify-between gap-5 border-t border-hair pt-6 pb-10 sm:flex-row">
          <p className="text-[13.5px] text-text-muted">
            {FOOTER_DATA.copyright}
          </p>
          <div className="flex gap-7">
            {FOOTER_DATA.legalLinks.map((link) => (
              <FooterLink
                key={link.label}
                href={link.href}
                label={link.label}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
