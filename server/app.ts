import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { type LocationStore, locationSchema } from "./locations/store.ts";
import { type Provider, ProviderError, placeSchema } from "./provider/provider.ts";

const healthSchema = z.object({
  status: z.literal("ok"),
  time: z.iso.datetime(),
});

const geocodeQuerySchema = z.object({ q: z.string().trim().min(1).max(100) });
const geocodeResponseSchema = z.object({ places: z.array(placeSchema) });
const locationListSchema = z.object({ locations: z.array(locationSchema) });
const locationResponseSchema = z.object({ location: locationSchema });

interface AppDependencies {
  provider: Provider;
  locations: LocationStore;
}

export function createApp({ provider, locations }: AppDependencies) {
  return new Hono()
    .onError((error, c) => {
      if (error instanceof ProviderError) {
        console.error(error);
        return c.json({ error: "The weather provider is unavailable" }, 502);
      }
      throw error;
    })
    .get("/api/health", (c) => {
      const body = healthSchema.parse({
        status: "ok",
        time: new Date().toISOString(),
      });
      return c.json(body);
    })
    .get(
      "/api/geocode",
      validator("query", (value, c) => {
        const parsed = geocodeQuerySchema.safeParse(value);
        if (!parsed.success) return c.json({ error: "Expected a search term in q" }, 400);
        return parsed.data;
      }),
      async (c) => {
        const { q } = c.req.valid("query");
        const body = geocodeResponseSchema.parse({
          places: await provider.geocode(q),
        });
        return c.json(body, 200);
      },
    )
    .get("/api/locations", async (c) => {
      const body = locationListSchema.parse({
        locations: await locations.list(),
      });
      return c.json(body, 200);
    })
    .post(
      "/api/locations",
      validator("json", (value, c) => {
        const parsed = locationSchema.safeParse(value);
        if (!parsed.success) return c.json({ error: "Expected a place to save" }, 400);
        return parsed.data;
      }),
      async (c) => {
        const { location, created } = await locations.add(c.req.valid("json"));
        const body = locationResponseSchema.parse({ location });
        return created ? c.json(body, 201) : c.json(body, 200);
      },
    );
}

export type AppType = ReturnType<typeof createApp>;
