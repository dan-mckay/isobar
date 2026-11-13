import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { ThemeToggle } from "./ThemeToggle.tsx";

const meta = {
  title: "Sidebar/ThemeToggle",
  component: ThemeToggle,
  args: {
    onThemeChange: fn(),
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { theme: "light" },
};

export const Dark: Story = {
  args: { theme: "dark" },
};

export const ToggledFromKeyboard: Story = {
  args: { theme: "light" },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("switch", { name: "Dark theme" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(args.onThemeChange).toHaveBeenCalledWith("dark");
  },
};
