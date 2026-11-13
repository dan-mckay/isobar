import { queryOptions } from "@tanstack/react-query";
import { client } from "../api.ts";

export const healthQuery = queryOptions({
  queryKey: ["health"],
  queryFn: async () => {
    const res = await client.api.health.$get();
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return res.json();
  },
});
