import { createContext } from "react";

export type Theme = "light" | "dark";

/** Shared with the pre-paint script in index.html — keep the two in sync. */
export const THEME_STORAGE_KEY = "fwt-theme";

export interface ThemeContextValue {
  readonly theme: Theme;
  readonly setTheme: (theme: Theme) => void;
  readonly toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
