import { Moon, Sun } from "lucide-react";
import useTheme from "@/client/context/useTheme";

interface ThemeSwitcherProps {
  readonly className?: string;
}

export default function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex items-center justify-center w-11 h-11 rounded-xl border border-raise-br bg-raise text-text-secondary hover:text-text-primary hover:border-hair-strong transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${className}`}
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}
