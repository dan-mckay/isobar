import { Button, PageMessage } from "../ui/index.ts";

/** Shown when the saved locations can't be loaded, which in practice means the API isn't running. */
export function LocationsUnavailable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <PageMessage
        title="Can't reach the Isobar API"
        action={
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        }
      >
        Your saved locations couldn't be loaded. Check that the API is running with npm run dev.
      </PageMessage>
    </div>
  );
}
