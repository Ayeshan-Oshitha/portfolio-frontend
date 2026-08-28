import { useContext } from "react";
import {
  ThemeContext,
  type ThemeContextValue,
} from "@/client/context/themeContext";

export default function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider.");
  }
  return context;
}
