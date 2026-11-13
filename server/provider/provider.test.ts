import { describe, expect, it, vi } from "vitest";
import dublin from "../fixtures/open-meteo/geocode-dublin.json" with { type: "json" };
import { dublinPlace } from "../fixtures/places.ts";
import { createOfflineProvider } from "./offline.ts";
import { createOpenMeteoProvider } from "./openMeteo.ts";
import { ProviderError } from "./provider.ts";

const [upstreamDublin] = dublin.results;
if (!upstreamDublin) throw new Error("The recorded geocode fixture has no results");

function respondWith(body: unknown, status = 200): typeof fetch {
  return async () => new Response(JSON.stringify(body), { status });
}

describe("Open-Meteo provider: geocode", () => {
  it("normalises upstream results into places with region and country", async () => {
    const provider = createOpenMeteoProvider({ fetch: respondWith(dublin) });

    const places = await provider.geocode("Dublin");

    expect(places).toHaveLength(5);
    expect(places[0]).toEqual({
      id: 2964574,
      name: "Dublin",
      region: "Leinster",
      country: "Ireland",
      latitude: 53.33306,
      longitude: -6.24889,
      timezone: "Europe/Dublin",
    });
    expect(places.slice(1).map((place) => place.region)).toEqual([
      "Georgia",
      "California",
      "Ohio",
      "Texas",
    ]);
  });

  it("returns no places when upstream finds nothing", async () => {
    const provider = createOpenMeteoProvider({
      fetch: respondWith({ generationtime_ms: 0.2 }),
    });

    expect(await provider.geocode("Xyzzy")).toEqual([]);
  });

  it("drops places it cannot label or tell the time for", async () => {
    const { country: _country, ...withoutCountry } = {
      ...upstreamDublin,
      id: 1,
    };
    const { timezone: _timezone, ...withoutTimezone } = {
      ...upstreamDublin,
      id: 2,
    };
    const provider = createOpenMeteoProvider({
      fetch: respondWith({
        results: [withoutCountry, withoutTimezone, upstreamDublin],
      }),
    });

    const places = await provider.geocode("Dublin");

    expect(places.map((place) => place.id)).toEqual([2964574]);
  });

  it("reports a missing region as null", async () => {
    const { admin1: _admin1, ...withoutRegion } = upstreamDublin;
    const provider = createOpenMeteoProvider({
      fetch: respondWith({ results: [withoutRegion] }),
    });

    const [place] = await provider.geocode("Dublin");

    expect(place?.region).toBeNull();
  });

  it("rejects malformed upstream JSON at the boundary", async () => {
    const provider = createOpenMeteoProvider({
      fetch: respondWith({ results: [{ id: "2964574", name: "Dublin" }] }),
    });

    await expect(provider.geocode("Dublin")).rejects.toBeInstanceOf(ProviderError);
  });

  it("fails hard when upstream answers with an error status", async () => {
    const provider = createOpenMeteoProvider({
      fetch: respondWith({ reason: "Internal" }, 500),
    });

    await expect(provider.geocode("Dublin")).rejects.toThrow("Open-Meteo answered 500");
  });

  it("fails hard when upstream is unreachable", async () => {
    const provider = createOpenMeteoProvider({
      fetch: async () => {
        throw new TypeError("fetch failed");
      },
    });

    await expect(provider.geocode("Dublin")).rejects.toThrow("Open-Meteo is unreachable");
  });
});

describe("offline provider: geocode", () => {
  const provider = createOfflineProvider();

  it.each(["Dublin", "dub", "  DUBLIN "])("answers %j with the bundled place", async (query) => {
    expect(await provider.geocode(query)).toEqual([dublinPlace]);
  });

  it("answers anything else with no places", async () => {
    expect(await provider.geocode("Paris")).toEqual([]);
  });

  it("never touches the network", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await provider.geocode("Dublin");

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
