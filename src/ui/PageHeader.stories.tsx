import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./PageHeader.tsx";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  args: { name: "Dublin", region: "Leinster", country: "Ireland" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Long names truncate rather than push the header's controls off the edge. */
export const LongText: Story = {
  args: {
    name: "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch",
    region: "Wales",
    country: "United Kingdom of Great Britain and Northern Ireland",
  },
};

/** Some places have no region; the country stands alone. */
export const NoRegion: Story = {
  args: { name: "Monaco", region: null, country: "Monaco" },
};
