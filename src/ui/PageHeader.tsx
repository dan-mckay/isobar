export interface PageHeaderProps {
  name: string;
  country: string;
}

/** The top of a location's dashboard: its name as the page heading, with the country beneath. */
export function PageHeader({ name, country }: PageHeaderProps) {
  return (
    <header className="flex min-w-0 flex-col gap-0.5 border-b border-border pb-card">
      <h1 className="truncate text-heading font-semibold">{name}</h1>
      <p className="truncate text-body text-text-muted">{country}</p>
    </header>
  );
}
