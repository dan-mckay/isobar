import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader.tsx";

describe("PageHeader", () => {
  it("names the page after the location and shows its country", () => {
    render(<PageHeader name="Dublin" country="Ireland" />);

    expect(screen.getByRole("heading", { level: 1, name: "Dublin" })).toBeTruthy();
    expect(screen.getByText("Ireland")).toBeTruthy();
  });
});
