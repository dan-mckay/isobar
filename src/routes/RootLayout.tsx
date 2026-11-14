import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { locationsQuery } from "../queries/locations.ts";
import { useSettings } from "../settings/SettingsContext.tsx";
import { SavedLocationItem, SavedLocationList, ThemeToggle } from "../ui/index.ts";
import { AddLocation } from "./AddLocation.tsx";
import { FocusSearchContext } from "./searchFocus.ts";

export function RootLayout() {
  const { theme, setTheme } = useSettings();
  const locations = useQuery(locationsQuery);
  const { locationId } = useParams({ strict: false });
  const searchRef = useRef<HTMLInputElement>(null);
  const focusSearch = useCallback(() => searchRef.current?.focus(), []);

  const isFirstRun = locations.isSuccess && locations.data.length === 0;
  useEffect(() => {
    if (isFirstRun) focusSearch();
  }, [isFirstRun, focusSearch]);

  return (
    <div className="flex min-h-dvh">
      <aside className="flex w-sidebar shrink-0 flex-col gap-6 border-r border-border bg-sunken p-card">
        <Link to="/" className="self-start text-title font-semibold text-text no-underline">
          Isobar
        </Link>
        <AddLocation inputRef={searchRef} />
        {locations.isSuccess && (
          <SavedLocationList emptyMessage="Locations you add will be listed here.">
            {locations.data.map((location) => (
              <SavedLocationItem
                key={location.id}
                name={location.name}
                region={location.region}
                country={location.country}
                active={String(location.id) === locationId}
                render={
                  <Link to="/location/$locationId" params={{ locationId: String(location.id) }} />
                }
              />
            ))}
          </SavedLocationList>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-card">
          <span className="text-body text-text-muted">Theme</span>
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col p-8">
        <FocusSearchContext value={focusSearch}>
          <Outlet />
        </FocusSearchContext>
      </main>
    </div>
  );
}
