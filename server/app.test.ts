import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.ts";
import { openDatabase } from "./db/database.ts";
import { dublinPlace } from "./fixtures/places.ts";
import { createMemoryLocationStore } from "./locations/memoryStore.ts";
import { createSqliteLocationStore } from "./locations/sqliteStore.ts";
import type { Location, LocationStore } from "./locations/store.ts";
import { createOfflineProvider } from "./provider/offline.ts";
import { ProviderError } from "./provider/provider.ts";

function offlineApp() {
  return createApp({
    provider: createOfflineProvider(),
    locations: createMemoryLocationStore(),
  });
}

describe("GET /api/geocode", () => {
  it("answers with matching places from the provider", async () => {
    const res = await offlineApp().request("/api/geocode?q=Dub");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ places: [dublinPlace] });
  });

  it.each(["/api/geocode", "/api/geocode?q=", "/api/geocode?q=%20%20"])(
    "rejects %s without a search term",
    async (path) => {
      const res = await offlineApp().request(path);

      expect(res.status).toBe(400);
    },
  );

  it("fails with 502 when the provider fails, rather than answering with nothing", async () => {
    const app = createApp({
      provider: {
        geocode: async () => {
          throw new ProviderError("Open-Meteo is unreachable");
        },
      },
      locations: createMemoryLocationStore(),
    });

    const res = await app.request("/api/geocode?q=Dublin");

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      error: "The weather provider is unavailable",
    });
  });
});

type App = ReturnType<typeof createApp>;

function post(app: App, body: unknown) {
  return app.request("/api/locations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function listed(app: App) {
  return (await app.request("/api/locations")).json();
}

const dublin = dublinPlace;
const wellington = {
  id: 2179537,
  name: "Wellington",
  region: "Wellington",
  country: "New Zealand",
  latitude: -41.28664,
  longitude: 174.77557,
  timezone: "Pacific/Auckland",
};

const stores: [string, () => Promise<LocationStore>][] = [
  ["in memory", async () => createMemoryLocationStore()],
  ["in SQLite", async () => createSqliteLocationStore(await openDatabase(":memory:"))],
];

describe.each(stores)("/api/locations, %s", (_name, createStore) => {
  async function appWithStore() {
    return createApp({
      provider: createOfflineProvider(),
      locations: await createStore(),
    });
  }

  it("starts with no saved locations", async () => {
    const res = await (await appWithStore()).request("/api/locations");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ locations: [] });
  });

  it("saves a place and lists saved locations in the order they were added", async () => {
    const app = await appWithStore();

    const created = await post(app, dublinPlace);
    await post(app, wellington);

    expect(created.status).toBe(201);
    expect(await created.json()).toEqual({ location: dublin });
    expect(await listed(app)).toEqual({ locations: [dublin, wellington] });
  });

  it("returns the existing location when the same place is saved again", async () => {
    const app = await appWithStore();
    await post(app, dublinPlace);
    await post(app, wellington);

    const again = await post(app, { ...dublinPlace, name: "Dublin again" });

    expect(again.status).toBe(200);
    expect(await again.json()).toEqual({ location: dublin });
    expect(await listed(app)).toEqual({ locations: [dublin, wellington] });
  });

  it("keeps a place's region, or its absence, so namesakes stay distinguishable", async () => {
    const app = await appWithStore();
    const monaco = {
      ...wellington,
      id: 2993458,
      name: "Monaco",
      region: null,
      country: "Monaco",
    };

    await post(app, dublinPlace);
    await post(app, monaco);

    const { locations } = (await listed(app)) as { locations: Location[] };
    expect(locations.map((location) => location.region)).toEqual(["Leinster", null]);
  });

  it.each([
    ["missing fields", { id: 1, name: "Nowhere" }],
    ["a latitude off the globe", { ...dublin, latitude: 91 }],
    ["a blank name", { ...dublin, name: "" }],
  ])("rejects a place with %s", async (_case, body) => {
    const app = await appWithStore();

    const res = await post(app, body);

    expect(res.status).toBe(400);
    expect(await listed(app)).toEqual({ locations: [] });
  });
});

describe("saved locations on disk", () => {
  it("survive closing and reopening the database file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "isobar-"));
    const file = join(dir, "isobar.sqlite");
    try {
      const first = await openDatabase(file);
      await post(
        createApp({
          provider: createOfflineProvider(),
          locations: createSqliteLocationStore(first),
        }),
        dublinPlace,
      );
      first.close();

      const reopened = await openDatabase(file);
      const app = createApp({
        provider: createOfflineProvider(),
        locations: createSqliteLocationStore(reopened),
      });

      expect(await listed(app)).toEqual({ locations: [dublin] });
      reopened.close();
    } finally {
      await rm(dir, { recursive: true });
    }
  });
});
