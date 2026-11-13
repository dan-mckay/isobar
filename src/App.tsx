import { useQuery } from "@tanstack/react-query";
import { healthQuery } from "./queries/health.ts";
import { useSettings } from "./settings/SettingsContext.tsx";
import { ThemeToggle } from "./ui/index.ts";

const timeFormat = new Intl.DateTimeFormat(undefined, { timeStyle: "medium" });

export function App() {
  const health = useQuery(healthQuery);
  const { theme, setTheme } = useSettings();

  let status = "checking";
  if (health.isError) status = "unreachable";
  if (health.isSuccess) {
    status = `${health.data.status}, checked ${timeFormat.format(new Date(health.data.time))}`;
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="flex w-sidebar shrink-0 flex-col gap-6 border-r border-border bg-sunken p-card">
        <h1 className="text-title font-semibold">Isobar</h1>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-card">
          <span className="text-body text-text-muted">Theme</span>
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
        </div>
      </aside>
      <main className="flex-1 p-8">
        <p className="text-body text-text-muted">API status: {status}</p>
      </main>
    </div>
  );
}
