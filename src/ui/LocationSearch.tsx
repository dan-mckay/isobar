import { Combobox } from "@base-ui/react/combobox";
import { type Ref, useId } from "react";

/** The least the search needs to show a place. Callers can pass richer objects and get them back. */
export interface LocationSearchResult {
  id: number;
  name: string;
  /** State, province or similar; tells apart places that share a name. */
  region: string | null;
  country: string;
}

export type LocationSearchStatus = "idle" | "searching" | "error";

export interface LocationSearchProps<T extends LocationSearchResult> {
  query: string;
  onQueryChange: (query: string) => void;
  /** Places matching the current query. */
  results: T[];
  status: LocationSearchStatus;
  onSelect: (result: T) => void;
  inputRef?: Ref<HTMLInputElement>;
}

function statusMessage(status: LocationSearchStatus, query: string, resultCount: number) {
  if (query.trim() === "") return null;
  if (status === "searching") return "Searching…";
  if (status === "error") return "Search is unavailable right now. Try again in a moment.";
  if (resultCount === 0) return `No places match “${query.trim()}”.`;
  return null;
}

function place(result: LocationSearchResult): string {
  return result.region ? `${result.region}, ${result.country}` : result.country;
}

/**
 * The sidebar's "add a location" search. It shows what it is given and reports what is typed
 * and chosen; searching itself happens outside.
 */
export function LocationSearch<T extends LocationSearchResult>({
  query,
  onQueryChange,
  results,
  status,
  onSelect,
  inputRef,
}: LocationSearchProps<T>) {
  const inputId = useId();
  const message = statusMessage(status, query, results.length);

  return (
    <Combobox.Root<T>
      items={results}
      filter={null}
      value={null}
      onValueChange={(result) => {
        if (result) onSelect(result);
      }}
      inputValue={query}
      onInputValueChange={(next, { reason }) => {
        // Choosing an item would copy its label into the input; the page decides what happens instead.
        if (reason !== "item-press") onQueryChange(next);
      }}
      itemToStringLabel={(result) => result.name}
      isItemEqualToValue={(a, b) => a.id === b.id}
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-label font-semibold tracking-label text-text-muted uppercase"
        >
          Add a location
        </label>
        <Combobox.Input
          id={inputId}
          ref={inputRef}
          placeholder="Search for a city"
          className="h-control w-full rounded-control border border-border-strong bg-surface px-2.5 text-body text-text placeholder:text-text-muted"
        />
      </div>

      <Combobox.Portal hidden={!message && results.length === 0}>
        <Combobox.Positioner sideOffset={4} align="start">
          <Combobox.Popup
            aria-busy={status === "searching" || undefined}
            className="w-(--anchor-width) overflow-hidden rounded-card border border-border bg-surface text-text shadow-popover"
          >
            <Combobox.Status>
              {message && <p className="px-2.5 py-2 text-body text-text-muted">{message}</p>}
            </Combobox.Status>
            <Combobox.List className="max-h-80 overflow-y-auto py-1">
              {(result: T) => (
                <Combobox.Item
                  key={result.id}
                  value={result}
                  className="flex cursor-pointer flex-col px-2.5 py-1.5 wrap-break-word data-highlighted:bg-sunken"
                >
                  <span className="text-body font-semibold">{result.name}</span>
                  <span className="text-label text-text-muted">{place(result)}</span>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
