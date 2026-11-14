/** "Ohio, United States", or just the country when there is no region. */
export function placeLabel(region: string | null | undefined, country: string): string {
  return region ? `${region}, ${country}` : country;
}
