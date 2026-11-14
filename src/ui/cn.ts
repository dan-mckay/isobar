/**
 * Joins class names, skipping falsy ones. It does not resolve conflicts, so never pass two
 * utilities that set the same property; which one wins would depend on stylesheet order.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
