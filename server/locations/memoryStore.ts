import type { Location, LocationStore } from "./store.ts";

/** A store that lives for one process. Lets the dashboard's tests run the real API in jsdom. */
export function createMemoryLocationStore(): LocationStore {
  const saved: Location[] = [];

  return {
    async list() {
      return [...saved];
    },
    async add(location) {
      const existing = saved.find((candidate) => candidate.id === location.id);
      if (existing) return { location: existing, created: false };
      saved.push(location);
      return { location, created: true };
    },
  };
}
