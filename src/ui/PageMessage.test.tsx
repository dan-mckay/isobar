import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageMessage } from "./PageMessage.tsx";

describe("PageMessage", () => {
  it("names its region after the heading and shows the sentence and action", () => {
    render(
      <PageMessage title="Location not found" action={<a href="/">Back to your locations</a>}>
        It may have been removed.
      </PageMessage>,
    );

    const region = screen.getByRole("region", { name: "Location not found" });
    expect(region.textContent).toContain("It may have been removed.");
    expect(screen.getByRole("link", { name: "Back to your locations" })).toBeTruthy();
  });
});
