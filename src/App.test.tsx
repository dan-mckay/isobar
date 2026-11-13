import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App.tsx";
import { SettingsProvider } from "./settings/SettingsContext.tsx";

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </QueryClientProvider>,
  );
}

describe("App", () => {
  it("switches the whole app between light and dark from the sidebar", async () => {
    renderApp();
    const sidebar = screen.getByRole("complementary");
    const toggle = within(sidebar).getByRole("switch", { name: "Dark theme" });

    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("dark");

    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
