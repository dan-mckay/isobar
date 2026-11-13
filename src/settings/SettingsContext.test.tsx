import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { stubColorScheme } from "../test/stubColorScheme.ts";
import { SettingsProvider, useSettings } from "./SettingsContext.tsx";

function ThemeProbe() {
  const { theme, setTheme } = useSettings();
  return (
    <>
      <output>{theme}</output>
      <button type="button" onClick={() => setTheme("dark")}>
        Choose dark
      </button>
    </>
  );
}

function renderWithSettings() {
  return render(
    <SettingsProvider>
      <ThemeProbe />
    </SettingsProvider>,
  );
}

describe("SettingsProvider", () => {
  it("follows the system colour scheme when no theme has been chosen", () => {
    stubColorScheme("dark");

    renderWithSettings();

    expect(screen.getByRole("status").textContent).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it.each([
    ["unparseable", "{not json"],
    ["an unknown theme", JSON.stringify({ theme: "sepia" })],
  ])("falls back to the system colour scheme when storage holds %s", (_, stored) => {
    localStorage.setItem("isobar.settings", stored);
    stubColorScheme("dark");

    renderWithSettings();

    expect(screen.getByRole("status").textContent).toBe("dark");
  });

  it("still switches theme when storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is disabled", "SecurityError");
    });
    renderWithSettings();

    await userEvent.click(screen.getByRole("button", { name: "Choose dark" }));

    expect(screen.getByRole("status").textContent).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("applies a chosen theme and remembers it across reloads", async () => {
    const firstVisit = renderWithSettings();
    await userEvent.click(screen.getByRole("button", { name: "Choose dark" }));

    expect(screen.getByRole("status").textContent).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    firstVisit.unmount();
    delete document.documentElement.dataset.theme;
    renderWithSettings();

    expect(screen.getByRole("status").textContent).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
