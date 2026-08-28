import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ThemeContext,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/client/context/themeContext";

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Storage is unavailable in private mode; treat it as "no preference".
    return null;
  }
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The choice just won't survive a reload.
  }
}

/**
 * The pre-paint script in index.html has already resolved and applied a
 * theme, so read that back instead of resolving it a second time — this
 * keeps React's first render identical to what is already on screen.
 */
function readAppliedTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(readAppliedTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    persistTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  // Follow the OS preference, but only for visitors who never picked one.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() === null) {
        setThemeState(event.matches ? "dark" : "light");
      }
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
