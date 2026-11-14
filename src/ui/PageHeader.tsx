import { placeLabel } from "./placeLabel.ts";

export interface PageHeaderProps {
  name: string;
  /** State, province or similar; omit or pass null when there is none. */
  region?: string | null;
  country: string;
}

/** The top of a location's dashboard: its name as the page heading, with where it is beneath. */
export function PageHeader({ name, region, country }: PageHeaderProps) {
  return (
    <header className="flex min-w-0 flex-col gap-0.5 border-b border-border pb-card">
      <h1 className="truncate text-heading font-semibold">{name}</h1>
      <p className="truncate text-body text-text-muted">{placeLabel(region, country)}</p>
    </header>
  );
}
