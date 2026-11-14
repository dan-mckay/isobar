import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch.tsx";

describe("Switch", () => {
  it("is a native button with the switch role and reports its state", () => {
    render(<Switch aria-label="Notifications" checked onCheckedChange={() => {}} />);

    const control = screen.getByRole("switch", { name: "Notifications" });
    expect(control.tagName).toBe("BUTTON");
    expect(control.getAttribute("aria-checked")).toBe("true");
  });

  it("asks to flip its state when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Notifications" checked={false} onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));

    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
  });

  it("ignores interaction when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Notifications"
        disabled
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
