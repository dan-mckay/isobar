import { Moon, Sun } from "lucide-react";

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
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      onClick={() => onThemeChange(isDark ? "light" : "dark")}
      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border-strong bg-sunken transition-colors aria-checked:border-accent aria-checked:bg-accent"
    >
      <span className="absolute left-0.5 inline-flex size-5 items-center justify-center rounded-full bg-text-muted text-surface transition-transform group-aria-checked:translate-x-5 group-aria-checked:bg-on-accent group-aria-checked:text-accent">
        <Icon aria-hidden="true" className="size-3" strokeWidth={2.25} />
      </span>
    </button>
  );
}
