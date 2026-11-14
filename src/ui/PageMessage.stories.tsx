import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, buttonStyles } from "./components/Button.tsx";
import { PageMessage } from "./PageMessage.tsx";

const meta = {
  title: "States/PageMessage",
  component: PageMessage,
  parameters: { layout: "centered" },
  args: {
    title: "Location not found",
    children: "It may have been removed, or the link is out of date.",
    action: (
      <a href="#locations" className={buttonStyles("outline")}>
        Back to your locations
      </a>
    ),
  },
} satisfies Meta<typeof PageMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLink: Story = {};

export const WithButton: Story = {
  args: {
    title: "Add a location to get started",
    children: "Search for a city to see its current conditions and the week ahead.",
    action: <Button>Add a location</Button>,
  },
};

export const LongText: Story = {
  args: {
    title: "We couldn't find Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch",
    children:
      "The location in this link is no longer in your saved list. It may have been removed on another visit, or the bookmark was made before it was saved.",
  },
};
