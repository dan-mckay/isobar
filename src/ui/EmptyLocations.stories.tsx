import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { EmptyLocations } from "./EmptyLocations.tsx";

const meta = {
  title: "States/EmptyLocations",
  component: EmptyLocations,
  args: { onAddLocation: fn() },
  parameters: { layout: "centered" },
} satisfies Meta<typeof EmptyLocations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AddLocationPressed: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Add a location" }));
    await expect(args.onAddLocation).toHaveBeenCalledOnce();
  },
};
