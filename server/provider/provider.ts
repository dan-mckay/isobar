import { z } from "zod";

/**
 * A place a user can save, in Isobar's own terms. The id is the geocoder's id for the
 * place, so the same place found twice is recognisably the same place.
 */
export const placeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  region: z.string().min(1).nullable(),
  country: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1),
});

export type Place = z.infer<typeof placeSchema>;

/** Thrown when the upstream service is unreachable, errors, or answers with something unexpected. */
export class ProviderError extends Error {
  override name = "ProviderError";
}

/** Everything Isobar asks of a weather data source. Nothing outside this module knows the upstream's field names. */
export interface Provider {
  geocode(query: string): Promise<Place[]>;
}
