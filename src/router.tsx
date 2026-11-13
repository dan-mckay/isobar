import {
  createRootRoute,
  createRoute,
  createRouter,
  type RouterHistory,
} from "@tanstack/react-router";
import { HomePage } from "./routes/HomePage.tsx";
import { LocationPage } from "./routes/LocationPage.tsx";
import { RootLayout } from "./routes/RootLayout.tsx";

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const locationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/location/$locationId",
  component: function LocationRoute() {
    const { locationId } = locationRoute.useParams();
    return <LocationPage locationId={locationId} />;
  },
});

const routeTree = rootRoute.addChildren([homeRoute, locationRoute]);

/** The dashboard's routes. The active location lives in the URL as `/location/:id`. */
export function createAppRouter({ history }: { history?: RouterHistory } = {}) {
  return createRouter({ routeTree, history });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
