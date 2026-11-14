import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { locationsQuery } from "../queries/locations.ts";
import { buttonStyles, PageHeader, PageMessage } from "../ui/index.ts";
import { LocationsUnavailable } from "./LocationsUnavailable.tsx";

/** One saved location's dashboard, chosen by the id in the URL. */
export function LocationPage({ locationId }: { locationId: string }) {
  const locations = useQuery(locationsQuery);

  if (locations.isError) return <LocationsUnavailable onRetry={() => locations.refetch()} />;
  if (!locations.isSuccess) return null;

  const location = locations.data.find(({ id }) => String(id) === locationId);
  if (!location) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <PageMessage
          title="Location not found"
          action={
            <Link to="/" className={buttonStyles("outline")}>
              Back to your locations
            </Link>
          }
        >
          It isn't in your saved locations. It may have been removed, or the link is out of date.
        </PageMessage>
      </div>
    );
  }

  return <PageHeader name={location.name} region={location.region} country={location.country} />;
}
