import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { expect, fn } from "storybook/test";
import { Switch } from "./Switch.tsx";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  args: {
    "aria-label": "Notifications",
    checked: false,
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** A visible label beside the switch, long enough to wrap. */
export const LongLabel: Story = {
  render: function LongLabel(args) {
    const id = useId();
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex w-56 items-start gap-3">
        <label htmlFor={id} className="text-body">
          Show temperatures in Fahrenheit across every card on the dashboard
        </label>
        <Switch
          {...args}
          aria-label={undefined}
          id={id}
          checked={checked}
          onCheckedChange={setChecked}
        />
      </div>
    );
  },
};

export const ToggledFromKeyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("switch", { name: "Notifications" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(args.onCheckedChange).toHaveBeenCalled();
  },
};
