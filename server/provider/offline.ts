import { dublinPlace } from "../fixtures/places.ts";
import type { Provider } from "./provider.ts";

/**
 * Answers from the bundled fixtures and never touches the network. Selected by
 * ISOBAR_OFFLINE=1 for Playwright, CI and tests.
 */
export function createOfflineProvider(): Provider {
  return {
    async geocode(query) {
      const needle = query.trim().toLowerCase();
      return dublinPlace.name.toLowerCase().startsWith(needle) ? [dublinPlace] : [];
    },
  };
}
