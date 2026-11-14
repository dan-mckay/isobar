import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";
import {
  LocationSearch,
  type LocationSearchResult,
  type LocationSearchStatus,
} from "./LocationSearch.tsx";

/** Fixture: what the geocoder returns for "Dublin". */
const dublins: LocationSearchResult[] = [
  { id: 2964574, name: "Dublin", region: "Leinster", country: "Ireland" },
  { id: 4192205, name: "Dublin", region: "Georgia", country: "United States" },
  {
    id: 5344157,
    name: "Dublin",
    region: "California",
    country: "United States",
  },
  { id: 5152333, name: "Dublin", region: "Ohio", country: "United States" },
];

interface HarnessProps {
  results: LocationSearchResult[];
  status: LocationSearchStatus;
  onSelect: (result: LocationSearchResult) => void;
}

/** Holds the typed query the way the page does; answers any non-empty query with `results`. */
function Harness({ results, status, onSelect }: HarnessProps) {
  const [query, setQuery] = useState("");
  return (
    <div className="w-64">
      <LocationSearch
        query={query}
        onQueryChange={setQuery}
        results={query ? results : []}
        status={query ? status : "idle"}
        onSelect={onSelect}
      />
    </div>
  );
}

const meta = {
  title: "Sidebar/LocationSearch",
  component: Harness,
  args: { results: dublins, status: "idle", onSelect: fn() },
} satisfies Meta<typeof Harness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithResults: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("combobox", { name: "Add a location" }), "Dublin");
  },
};

export const ChosenFromKeyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("combobox", { name: "Add a location" }), "Dublin");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await expect(args.onSelect).toHaveBeenCalledWith(dublins[1]);
  },
};

export const Searching: Story = {
  args: { results: [], status: "searching" },
  play: WithResults.play,
};

export const ErrorState: Story = {
  name: "Error",
  args: { results: [], status: "error" },
  play: WithResults.play,
};

export const Empty: Story = {
  name: "No matches",
  args: { results: [] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("combobox", { name: "Add a location" }), "Xyzzy");
  },
};

export const LongText: Story = {
  args: {
    results: [
      {
        id: 2643732,
        name: "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch",
        region: "Wales",
        country: "United Kingdom of Great Britain and Northern Ireland",
      },
      {
        id: 3904906,
        name: "Santa Cruz de la Sierra",
        region: "Santa Cruz",
        country: "Bolivia",
      },
    ],
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("combobox", { name: "Add a location" }), "Llan");
  },
};
