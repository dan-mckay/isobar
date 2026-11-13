import { mutationOptions, type QueryClient, queryOptions } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";
import { client } from "../api.ts";

const $list = client.api.locations.$get;
const $save = client.api.locations.$post;

export type SavedLocation = InferResponseType<typeof $list, 200>["locations"][number];
export type LocationToSave = InferRequestType<typeof $save>["json"];

export const locationsKey = ["locations"] as const;

export const locationsQuery = queryOptions({
  queryKey: locationsKey,
  queryFn: async () => {
    const res = await $list();
    if (!res.ok) throw new Error(`Loading saved locations failed with status ${res.status}`);
    return (await res.json()).locations;
  },
});

/** Saves a place; the API answers with the existing location if it was already saved. */
export function saveLocationMutation(queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: async (location: LocationToSave) => {
      const res = await $save({ json: location });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Saving the location failed with status ${res.status}`);
      }
      return (await res.json()).location;
    },
    // Put the location in the list before anyone navigates to it, so its page never sees a
    // list without it; then refetch to pick up the server's order.
    onSuccess: async (location) => {
      queryClient.setQueryData(locationsKey, (saved: SavedLocation[] = []) =>
        saved.some(({ id }) => id === location.id) ? saved : [...saved, location],
      );
      await queryClient.invalidateQueries({ queryKey: locationsKey });
    },
  });
}
