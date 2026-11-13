import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button.tsx";

describe("Button", () => {
  it("is a real button that acts when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Add a location</Button>);

    const button = screen.getByRole("button", { name: "Add a location" });
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("can be activated from the keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Add a location</Button>);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("ignores clicks when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Add a location
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add a location" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
