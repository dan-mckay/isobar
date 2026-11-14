import type { Place } from "../provider/provider.ts";

/**
 * Fixture: the one bundled location. Tooling data for tests, stories and the offline
 * API; never served to real users. Matches the first result in open-meteo/geocode-dublin.json.
 */
export const dublinPlace: Place = {
  id: 2964574,
  name: "Dublin",
  region: "Leinster",
  country: "Ireland",
  latitude: 53.33306,
  longitude: -6.24889,
  timezone: "Europe/Dublin",
};
