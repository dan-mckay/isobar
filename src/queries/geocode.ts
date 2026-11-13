import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { client } from "../api.ts";

export function geocodeQuery(q: string) {
  return queryOptions({
    queryKey: ["geocode", q] as const,
    queryFn: async () => {
      const res = await client.api.geocode.$get({ query: { q } });
      if (!res.ok) throw new Error(`Search failed with status ${res.status}`);
      return (await res.json()).places;
    },
    enabled: q.trim() !== "",
    // Keep the last results on screen while the next query is in flight.
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
