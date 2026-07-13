import { Link } from "react-router-dom";
import { BRAND } from "@/portfolio/data/navigation";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* Icon Mark */}
      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 shadow-lg shadow-primary-600/20 group-hover:shadow-primary-500/40 transition-all duration-300 transform group-hover:scale-105">
        <span className="text-white font-black text-lg sm:text-xl tracking-tighter leading-none mt-0.5">
          {BRAND.name.charAt(0)}
        </span>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <span className="text-base sm:text-lg font-black tracking-tight text-text-primary uppercase leading-none mb-1">
          {BRAND.name}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase leading-none">
          {BRAND.tagline}
        </span>
      </div>
    </Link>
  );
}
