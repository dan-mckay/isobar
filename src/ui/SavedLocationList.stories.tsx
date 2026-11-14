import type { Meta, StoryObj } from "@storybook/react-vite";
import { SavedLocationItem, SavedLocationList } from "./SavedLocationList.tsx";

const meta = {
  title: "Sidebar/SavedLocationList",
  component: SavedLocationList,
  args: {
    emptyMessage: "Locations you add will be listed here.",
    children: [],
  },
  decorators: [
    (Story) => (
      <div className="w-sidebar bg-sunken p-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SavedLocationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [
      <SavedLocationItem
        key="1"
        name="Dublin"
        region="Leinster"
        country="Ireland"
        href="#dublin"
        active
      />,
      <SavedLocationItem key="2" name="Wellington" country="New Zealand" href="#wellington" />,
      <SavedLocationItem
        key="3"
        name="Dublin"
        region="Ohio"
        country="United States"
        href="#dublin-ohio"
      />,
    ],
  },
};

export const Empty: Story = {};

export const LongText: Story = {
  args: {
    children: [
      <SavedLocationItem
        key="1"
        name="Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch"
        country="United Kingdom of Great Britain and Northern Ireland"
        href="#llanfair"
        active
      />,
      <SavedLocationItem
        key="2"
        name="Santa Cruz de la Sierra"
        country="Plurinational State of Bolivia"
        href="#santa-cruz"
      />,
    ],
  },
};
