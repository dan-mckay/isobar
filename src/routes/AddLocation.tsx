import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type Ref, useState } from "react";
import { geocodeQuery } from "../queries/geocode.ts";
import { saveLocationMutation } from "../queries/locations.ts";
import { LocationSearch, type LocationSearchStatus } from "../ui/index.ts";
import { useDebouncedValue } from "../useDebouncedValue.ts";

const SEARCH_DELAY_MS = 250;

/** The sidebar search, wired up: geocodes as you type, saves the chosen place and opens it. */
export function AddLocation({ inputRef }: { inputRef: Ref<HTMLInputElement> }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DELAY_MS);
  const places = useQuery(geocodeQuery(debouncedQuery));
  const save = useMutation(saveLocationMutation(useQueryClient()));
  const navigate = useNavigate();

  const settling = query.trim() !== debouncedQuery || places.isFetching;
  let status: LocationSearchStatus = "idle";
  if (places.isError) status = "error";
  else if (settling || save.isPending) status = "searching";

  return (
    <LocationSearch
      inputRef={inputRef}
      query={query}
      onQueryChange={setQuery}
      results={query.trim() ? (places.data ?? []) : []}
      status={status}
      onSelect={(place) => {
        save.mutate(place, {
          onSuccess: async (location) => {
            setQuery("");
            await navigate({
              to: "/location/$locationId",
              params: { locationId: String(location.id) },
            });
          },
        });
      }}
    />
  );
}
