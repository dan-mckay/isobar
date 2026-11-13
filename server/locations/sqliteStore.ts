import { asc, eq, max } from "drizzle-orm";
import type { Database } from "../db/database.ts";
import { locations } from "../db/schema.ts";
import type { Location, LocationStore } from "./store.ts";

const columns = {
  id: locations.id,
  name: locations.name,
  country: locations.country,
  latitude: locations.latitude,
  longitude: locations.longitude,
  timezone: locations.timezone,
};

export function createSqliteLocationStore({ orm }: Database): LocationStore {
  async function find(id: number): Promise<Location | undefined> {
    const [row] = await orm.select(columns).from(locations).where(eq(locations.id, id));
    return row;
  }

  return {
    async list() {
      return orm.select(columns).from(locations).orderBy(asc(locations.sortOrder));
    },

    async add(location) {
      const existing = await find(location.id);
      if (existing) return { location: existing, created: false };

      const [last] = await orm.select({ sortOrder: max(locations.sortOrder) }).from(locations);
      await orm.insert(locations).values({ ...location, sortOrder: (last?.sortOrder ?? -1) + 1 });
      return { location, created: true };
    },
  };
}
