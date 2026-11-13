import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Theme } from "../ui/index.ts";

/** Also read by the inline script in index.html, which applies the theme before first paint. */
const STORAGE_KEY = "isobar.settings";

interface StoredSettings {
  theme?: Theme;
}

interface Settings {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<Settings | null>(null);

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** Anything unreadable or unrecognised in storage is treated as not set. */
function readStored(): StoredSettings {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    const theme = (stored as StoredSettings | null)?.theme;
    return isTheme(theme) ? { theme } : {};
  } catch {
    return {};
  }
}

function initialTheme(): Theme {
  return (
    readStored().theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function setTheme(next: Theme) {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), theme: next }));
    } catch {
      // Storage is blocked or full: the choice still applies for this visit.
    }
  }

  return <SettingsContext value={{ theme, setTheme }}>{children}</SettingsContext>;
}

export function useSettings(): Settings {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error("useSettings must be used inside <SettingsProvider>");
  return settings;
}
