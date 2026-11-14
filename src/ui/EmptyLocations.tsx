import { Button } from "./components/Button.tsx";
import { PageMessage } from "./PageMessage.tsx";

export interface EmptyLocationsProps {
  /** Called by the one button; the page moves focus to the location search. */
  onAddLocation: () => void;
}

/** First run: no saved locations yet. No illustration and no sample data, by design. */
export function EmptyLocations({ onAddLocation }: EmptyLocationsProps) {
  return (
    <PageMessage
      title="Add a location to get started"
      action={<Button onClick={onAddLocation}>Add a location</Button>}
    >
      Search for a city to see its current conditions and the week ahead.
    </PageMessage>
  );
}
