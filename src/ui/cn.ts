/** Joins class names, skipping falsy ones. No merging: our token utilities don't conflict by design. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
