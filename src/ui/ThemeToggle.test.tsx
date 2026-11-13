import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle.tsx";

describe("ThemeToggle", () => {
  it("is a switch named 'Dark theme' that is off in the light theme", () => {
    render(<ThemeToggle theme="light" onThemeChange={() => {}} />);

    const toggle = screen.getByRole("switch", { name: "Dark theme" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });

  it("is on in the dark theme", () => {
    render(<ThemeToggle theme="dark" onThemeChange={() => {}} />);

    expect(screen.getByRole("switch", { name: "Dark theme" }).getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it.each([
    ["light", "dark"],
    ["dark", "light"],
  ] as const)("asks for the %s theme's opposite (%s) when clicked", async (theme, next) => {
    const onThemeChange = vi.fn();
    render(<ThemeToggle theme={theme} onThemeChange={onThemeChange} />);

    await userEvent.click(screen.getByRole("switch", { name: "Dark theme" }));

    expect(onThemeChange).toHaveBeenCalledExactlyOnceWith(next);
  });

  it("can be operated from the keyboard", async () => {
    const onThemeChange = vi.fn();
    render(<ThemeToggle theme="light" onThemeChange={onThemeChange} />);

    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("switch", { name: "Dark theme" }));
    await userEvent.keyboard(" ");

    expect(onThemeChange).toHaveBeenCalledExactlyOnceWith("dark");
  });
});
