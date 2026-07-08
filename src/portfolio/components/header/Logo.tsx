import { BRAND } from "../../data/navigation";

export default function Logo() {
  return (
    <a href="/" className="flex items-center gap-3 group" aria-label="Home">
      {/* Logo mark */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-600/30 group-hover:shadow-primary-500/50 transition-shadow duration-300">
        <span className="text-lg font-bold text-white leading-none">
          {BRAND.name.charAt(0)}
        </span>
      </div>

      {/* Brand text */}
      <div className="hidden sm:flex flex-col">
        <span className="text-sm font-bold text-text-primary tracking-wide uppercase leading-none">
          {BRAND.name}
        </span>
        <span className="text-[10px] font-medium text-text-muted tracking-wider uppercase mt-0.5">
          {BRAND.tagline}
        </span>
      </div>
    </a>
  );
}
