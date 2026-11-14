import { z } from "zod";
import { type Place, type Provider, ProviderError } from "./provider.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const RESULT_COUNT = 8;

/** Only the fields Isobar reads. Upstream omits `results` entirely when nothing matches. */
const upstreamGeocodeSchema = z.object({
  results: z
    .array(
      z.object({
        id: z.number().int().positive(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        timezone: z.string().optional(),
        country: z.string().optional(),
        admin1: z.string().optional(),
      }),
    )
    .default([]),
});

interface OpenMeteoOptions {
  fetch?: typeof fetch;
}

export function createOpenMeteoProvider({
  fetch: fetchFn = fetch,
}: OpenMeteoOptions = {}): Provider {
  async function getJson(url: URL): Promise<unknown> {
    let response: Response;
    try {
      response = await fetchFn(url);
    } catch (cause) {
      throw new ProviderError("Open-Meteo is unreachable", { cause });
    }
    if (!response.ok) throw new ProviderError(`Open-Meteo answered ${response.status}`);
    return response.json();
  }

  return {
    async geocode(query) {
      const url = new URL(GEOCODING_URL);
      url.search = new URLSearchParams({
        name: query,
        count: String(RESULT_COUNT),
        language: "en",
        format: "json",
      }).toString();

      const parsed = upstreamGeocodeSchema.safeParse(await getJson(url));
      if (!parsed.success) {
        throw new ProviderError("Open-Meteo geocoding returned an unexpected shape", {
          cause: parsed.error,
        });
      }

      // A place without a country or timezone can't be labelled or shown in local time.
      return parsed.data.results.flatMap((result): Place[] => {
        if (!result.country || !result.timezone) return [];
        return [
          {
            id: result.id,
            name: result.name,
            region: result.admin1 ?? null,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude,
            timezone: result.timezone,
          },
        ];
      });
    },
  };
}
