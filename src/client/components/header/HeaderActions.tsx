import { SOCIAL_LINKS } from "@/client/data/navigation";

export default function HeaderActions() {
  return (
    <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
      {/* Divider */}
      <div className="w-px h-5 bg-white/15 mx-2" aria-hidden="true" />

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
              className="flex items-center justify-center w-9 h-9 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
            >
              <Icon size={17} />
            </a>
          );
        })}
      </div>

      {/* CTA */}
      <a
        href="/contact"
        className="px-5 py-2.5 rounded-full border border-white/25 bg-white/5 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-200 whitespace-nowrap"
      >
        Get a Free Quote
      </a>
    </div>
  );
}
