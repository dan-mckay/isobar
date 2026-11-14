import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader.tsx";

describe("PageHeader", () => {
  it("names the page after the location and shows its region and country", () => {
    render(<PageHeader name="Dublin" region="Ohio" country="United States" />);

    expect(screen.getByRole("heading", { level: 1, name: "Dublin" })).toBeTruthy();
    expect(screen.getByText("Ohio, United States")).toBeTruthy();
  });

  it("shows the country alone when the location has no region", () => {
    render(<PageHeader name="Monaco" region={null} country="Monaco" />);

    expect(screen.getByText("Monaco", { selector: "p" })).toBeTruthy();
  });
});
