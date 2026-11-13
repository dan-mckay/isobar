import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory } from "@tanstack/react-router";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../server/app.ts";
import { dublinPlace } from "../server/fixtures/places.ts";
import { createMemoryLocationStore } from "../server/locations/memoryStore.ts";
import { createOfflineProvider } from "../server/provider/offline.ts";
import { App } from "./App.tsx";
import { createAppRouter } from "./router.tsx";
import { SettingsProvider } from "./settings/SettingsContext.tsx";

const wellington = {
  id: 2179537,
  name: "Wellington",
  country: "New Zealand",
  latitude: -41.28664,
  longitude: 174.77557,
  timezone: "Pacific/Auckland",
};

/**
 * Renders the dashboard at `path` against the real API running in-process, offline and with
 * an in-memory store, so every request goes through the same routes and validation as in dev.
 */
async function renderApp(path = "/", { saved = [] as object[] } = {}) {
  const api = createApp({
    provider: createOfflineProvider(),
    locations: createMemoryLocationStore(),
  });
  for (const location of saved) {
    await api.request("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
  }
  vi.stubGlobal("fetch", (input: RequestInfo | URL, init?: RequestInit) =>
    api.request(input instanceof Request ? input : String(input), init),
  );

  const history = createMemoryHistory({ initialEntries: [path] });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <App router={createAppRouter({ history })} />
      </SettingsProvider>
    </QueryClientProvider>,
  );
  return { history };
}

function sidebar() {
  return screen.getByRole("complementary");
}

function search() {
  return within(sidebar()).getByRole("combobox", { name: "Add a location" });
}

describe("first run", () => {
  it("shows the empty state with the search focused and a helper line", async () => {
    await renderApp();

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Add a location to get started",
      }),
    ).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(search()));
    expect(within(sidebar()).getByText("Locations you add will be listed here.")).toBeTruthy();
  });

  it("moves focus to the search from the empty state's button", async () => {
    await renderApp();
    const button = await screen.findByRole("button", {
      name: "Add a location",
    });
    await waitFor(() => expect(document.activeElement).toBe(search()));
    search().blur();

    await userEvent.click(button);

    expect(document.activeElement).toBe(search());
  });
});

describe("adding a location", () => {
  it("saves the chosen place, opens its dashboard and highlights it", async () => {
    const { history } = await renderApp();
    await screen.findByRole("heading", {
      name: "Add a location to get started",
    });

    await userEvent.type(search(), "Dub");
    await userEvent.click(await screen.findByRole("option", { name: /Dublin/ }));

    expect(await screen.findByRole("heading", { level: 1, name: "Dublin" })).toBeTruthy();
    expect(within(screen.getByRole("main")).getByText("Ireland")).toBeTruthy();
    expect(history.location.pathname).toBe(`/location/${dublinPlace.id}`);
    const nav = within(sidebar()).getByRole("navigation", {
      name: "Saved locations",
    });
    expect(within(nav).getByRole("link", { current: "page" }).textContent).toContain("Dublin");
    expect((search() as HTMLInputElement).value).toBe("");
  });

  it("opens the existing location when an already saved place is chosen again", async () => {
    const { history } = await renderApp(`/location/${wellington.id}`, {
      saved: [dublinPlace, wellington],
    });
    await screen.findByRole("heading", { level: 1, name: "Wellington" });

    await userEvent.type(search(), "Dub");
    await userEvent.click(await screen.findByRole("option", { name: /Dublin/ }));

    expect(await screen.findByRole("heading", { level: 1, name: "Dublin" })).toBeTruthy();
    expect(history.location.pathname).toBe(`/location/${dublinPlace.id}`);
    const nav = within(sidebar()).getByRole("navigation", {
      name: "Saved locations",
    });
    expect(within(nav).getAllByRole("link")).toHaveLength(2);
  });
});

describe("the URL is the active location", () => {
  it("opens a location straight from its URL, as on refresh or from a bookmark", async () => {
    await renderApp(`/location/${wellington.id}`, {
      saved: [dublinPlace, wellington],
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Wellington" })).toBeTruthy();
    expect(within(sidebar()).getByRole("link", { current: "page" }).textContent).toContain(
      "Wellington",
    );
  });

  it("goes to the first saved location from the root", async () => {
    const { history } = await renderApp("/", {
      saved: [dublinPlace, wellington],
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Dublin" })).toBeTruthy();
    expect(history.location.pathname).toBe(`/location/${dublinPlace.id}`);
  });

  it("follows back and forward between locations", async () => {
    const { history } = await renderApp(`/location/${dublinPlace.id}`, {
      saved: [dublinPlace, wellington],
    });
    await screen.findByRole("heading", { level: 1, name: "Dublin" });

    await userEvent.click(within(sidebar()).getByRole("link", { name: /Wellington/ }));
    expect(await screen.findByRole("heading", { level: 1, name: "Wellington" })).toBeTruthy();

    act(() => history.back());
    expect(await screen.findByRole("heading", { level: 1, name: "Dublin" })).toBeTruthy();
    expect(within(sidebar()).getByRole("link", { current: "page" }).textContent).toContain(
      "Dublin",
    );
  });

  it.each(["/location/999", "/location/not-a-number"])(
    "explains %s isn't saved and offers a way back",
    async (path) => {
      const { history } = await renderApp(path, { saved: [dublinPlace] });

      expect(
        await screen.findByRole("heading", {
          level: 1,
          name: "Location not found",
        }),
      ).toBeTruthy();
      await userEvent.click(screen.getByRole("link", { name: "Back to your locations" }));

      expect(await screen.findByRole("heading", { level: 1, name: "Dublin" })).toBeTruthy();
      expect(history.location.pathname).toBe(`/location/${dublinPlace.id}`);
    },
  );
});

describe("theme", () => {
  it("switches the whole app between light and dark from the sidebar", async () => {
    await renderApp();
    await screen.findByRole("complementary");
    const toggle = within(sidebar()).getByRole("switch", {
      name: "Dark theme",
    });

    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("dark");

    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
