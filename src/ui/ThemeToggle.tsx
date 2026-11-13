import { Moon, Sun } from "lucide-react";
import { Switch } from "./components/Switch.tsx";

export type Theme = "light" | "dark";

export interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

/** Switches between the light and dark themes. Sits at the foot of the sidebar. */
export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;

  return (
    <Switch
      aria-label="Dark theme"
      checked={isDark}
      onCheckedChange={(checked) => onThemeChange(checked ? "dark" : "light")}
    >
      <Icon aria-hidden="true" className="size-3" strokeWidth={2.25} />
    </Switch>
  );
}
