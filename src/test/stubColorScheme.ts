import { vi } from "vitest";

/** jsdom has no `matchMedia`; this stands in for the system colour-scheme preference. */
export function stubColorScheme(scheme: "light" | "dark") {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === `(prefers-color-scheme: ${scheme})`,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}
