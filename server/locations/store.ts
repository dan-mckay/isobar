import type { z } from "zod";
import { placeSchema } from "../provider/provider.ts";

/** A saved location. Its id is the place's geocoder id, which is what makes saving idempotent. */
export const locationSchema = placeSchema.pick({
  id: true,
  name: true,
  country: true,
  latitude: true,
  longitude: true,
  timezone: true,
});

export type Location = z.infer<typeof locationSchema>;

export interface AddResult {
  location: Location;
  /** False when the place was already saved; the existing location is returned untouched. */
  created: boolean;
}

/** Saved locations, in the user's order. */
export interface LocationStore {
  list(): Promise<Location[]>;
  /** Appends a location to the end of the list, or returns it unchanged if it is already saved. */
  add(location: Location): Promise<AddResult>;
}
