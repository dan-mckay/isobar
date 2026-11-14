import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Button, buttonStyles } from "./Button.tsx";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: {
    children: "Add a location",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const LongText: Story = {
  args: {
    children: "Add another location to compare against the one you are viewing",
  },
};

/** A real link that borrows the button's look through `buttonStyles`. */
export const LinkWithButtonLook: Story = {
  render: () => (
    <a href="#locations" className={buttonStyles("outline")}>
      Back to your locations
    </a>
  ),
};

export const ActivatedFromKeyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Add a location" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalled();
  },
};
