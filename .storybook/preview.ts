import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "error",
    },
  },
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  },
  decorators: [
    (Story, { globals }) => {
      document.documentElement.dataset.theme = globals.theme === "dark" ? "dark" : "light";
      return Story();
    },
  ],
};

export default preview;
