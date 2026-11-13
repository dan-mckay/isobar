import { render, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { SavedLocationItem, SavedLocationList } from "./SavedLocationList.tsx";

/** Stands in for a router link component. */
function RouterLink(props: ComponentProps<"a">) {
  return <a {...props} data-router-link="" />;
}

const emptyMessage = "Saved locations will appear here.";

describe("SavedLocationList", () => {
  it("lists saved locations as links inside a labelled navigation", () => {
    render(
      <SavedLocationList emptyMessage={emptyMessage}>
        <SavedLocationItem name="Dublin" country="Ireland" href="/location/1" />
        <SavedLocationItem name="Wellington" country="New Zealand" href="/location/2" />
      </SavedLocationList>,
    );

    const nav = screen.getByRole("navigation", { name: "Saved locations" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/location/1", "/location/2"]);
    expect(links[0]?.textContent).toContain("Dublin");
    expect(links[0]?.textContent).toContain("Ireland");
    expect(screen.queryByText(emptyMessage)).toBeNull();
  });

  it("marks only the active location as the current page", () => {
    render(
      <SavedLocationList emptyMessage={emptyMessage}>
        <SavedLocationItem name="Dublin" country="Ireland" href="/location/1" active />
        <SavedLocationItem name="Wellington" country="New Zealand" href="/location/2" />
      </SavedLocationList>,
    );

    expect(screen.getByRole("link", { current: "page" }).textContent).toContain("Dublin");
    expect(screen.getByRole("link", { name: /Wellington/ }).hasAttribute("aria-current")).toBe(
      false,
    );
  });

  it("shows the helper line instead of a list when nothing is saved", () => {
    render(<SavedLocationList emptyMessage={emptyMessage}>{[]}</SavedLocationList>);

    expect(screen.getByText(emptyMessage)).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("renders each location through a supplied link component", () => {
    render(
      <SavedLocationList emptyMessage={emptyMessage}>
        <SavedLocationItem
          name="Dublin"
          country="Ireland"
          href="/location/1"
          render={<RouterLink />}
        />
      </SavedLocationList>,
    );

    expect(screen.getByRole("link", { name: /Dublin/ }).hasAttribute("data-router-link")).toBe(
      true,
    );
  });
});
