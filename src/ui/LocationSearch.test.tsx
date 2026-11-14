import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  LocationSearch,
  type LocationSearchResult,
  type LocationSearchStatus,
} from "./LocationSearch.tsx";

const dublins: LocationSearchResult[] = [
  { id: 1, name: "Dublin", region: "Leinster", country: "Ireland" },
  { id: 2, name: "Dublin", region: "Ohio", country: "United States" },
];

/** Holds the query the way the page does, and answers any non-empty query with `results`. */
function Search({
  results = dublins,
  status = "idle",
  onSelect = () => {},
}: {
  results?: LocationSearchResult[];
  status?: LocationSearchStatus;
  onSelect?: (result: LocationSearchResult) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <LocationSearch
      query={query}
      onQueryChange={setQuery}
      results={query ? results : []}
      status={query ? status : "idle"}
      onSelect={onSelect}
    />
  );
}

describe("LocationSearch", () => {
  it("is a labelled combobox that reports what is typed", async () => {
    const onQueryChange = vi.fn();
    render(
      <LocationSearch
        query=""
        onQueryChange={onQueryChange}
        results={[]}
        status="idle"
        onSelect={() => {}}
      />,
    );

    await userEvent.type(screen.getByRole("combobox", { name: "Add a location" }), "D");

    expect(onQueryChange).toHaveBeenCalledWith("D");
  });

  it("lists matching places with their region and country", async () => {
    render(<Search />);

    await userEvent.type(screen.getByRole("combobox", { name: "Add a location" }), "Dub");

    const options = await screen.findAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual([
      "DublinLeinster, Ireland",
      "DublinOhio, United States",
    ]);
  });

  it("chooses a place with the pointer", async () => {
    const onSelect = vi.fn();
    render(<Search onSelect={onSelect} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Add a location" }), "Dub");
    await userEvent.click(await screen.findByRole("option", { name: /Ohio/ }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(dublins[1]);
  });

  it("chooses a place from the keyboard", async () => {
    const onSelect = vi.fn();
    render(<Search onSelect={onSelect} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Add a location" }), "Dub");
    await screen.findAllByRole("option");
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(dublins[0]);
  });

  it.each([
    ["searching", [], "Searching…"],
    ["error", [], "Search is unavailable right now. Try again in a moment."],
    ["idle", [], "No places match “Xyz”."],
  ] as const)("announces the %s state", async (status, results, message) => {
    render(<Search status={status} results={[...results]} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Add a location" }), "Xyz");

    expect(await screen.findByText(message)).toBeTruthy();
  });
});
