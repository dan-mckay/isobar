import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Children, type ReactNode } from "react";
import { cn } from "./cn.ts";
import { placeLabel } from "./placeLabel.ts";

export interface SavedLocationListProps {
  /** `SavedLocationItem`s, in the user's order. */
  children: ReactNode;
  /** The quiet line shown where the list would be when nothing is saved yet. */
  emptyMessage: string;
}

/** The sidebar's saved locations: a labelled navigation, or a helper line when there are none. */
export function SavedLocationList({ children, emptyMessage }: SavedLocationListProps) {
  if (Children.count(children) === 0) {
    return <p className="px-2 text-body text-text-muted">{emptyMessage}</p>;
  }

  return (
    <nav aria-label="Saved locations">
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </nav>
  );
}

export interface SavedLocationItemProps extends useRender.ComponentProps<"a"> {
  name: string;
  /** State, province or similar; omit or pass null when there is none. */
  region?: string | null;
  country: string;
  /** The location on screen. Highlighted and announced as the current page. */
  active?: boolean;
}

/**
 * One saved location. Renders an `<a>`; pass `render` to use a router's link component instead.
 */
export function SavedLocationItem({
  name,
  region,
  country,
  active = false,
  render,
  ...props
}: SavedLocationItemProps) {
  const link = useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        "aria-current": active ? "page" : undefined,
        className: cn(
          "flex min-w-0 flex-col rounded-control px-2 py-1.5 no-underline transition-colors",
          active ? "bg-accent-subtle" : "hover:bg-surface",
        ),
        children: (
          <>
            <span className="truncate text-body font-semibold text-text">{name}</span>
            <span className="truncate text-label text-text-muted">
              {placeLabel(region, country)}
            </span>
          </>
        ),
      },
      props,
    ),
  });

  return <li>{link}</li>;
}
