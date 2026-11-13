import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { locationsQuery } from "../queries/locations.ts";
import { EmptyLocations } from "../ui/index.ts";
import { LocationsUnavailable } from "./LocationsUnavailable.tsx";
import { useFocusSearch } from "./searchFocus.ts";

/** The root: the first-run empty state, or straight on to the first saved location. */
export function HomePage() {
  const locations = useQuery(locationsQuery);
  const focusSearch = useFocusSearch();

  if (locations.isError) return <LocationsUnavailable onRetry={() => locations.refetch()} />;
  if (!locations.isSuccess) return null;

  const [first] = locations.data;
  if (!first) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyLocations onAddLocation={focusSearch} />
      </div>
    );
  }
  return <Navigate to="/location/$locationId" params={{ locationId: String(first.id) }} replace />;
}
