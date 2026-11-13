import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { stubColorScheme } from "./stubColorScheme.ts";

beforeEach(() => {
  stubColorScheme("light");
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});
