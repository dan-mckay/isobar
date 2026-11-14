import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyLocations } from "./EmptyLocations.tsx";

describe("EmptyLocations", () => {
  it("says what to do with one heading, one sentence and one button", () => {
    render(<EmptyLocations onAddLocation={() => {}} />);

    expect(screen.getByRole("heading", { name: "Add a location to get started" })).toBeTruthy();
    expect(screen.getByText(/search for a city/i)).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("asks for the search when its button is pressed", async () => {
    const onAddLocation = vi.fn();
    render(<EmptyLocations onAddLocation={onAddLocation} />);

    await userEvent.click(screen.getByRole("button", { name: "Add a location" }));

    expect(onAddLocation).toHaveBeenCalledOnce();
  });
});
