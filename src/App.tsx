import { RouterProvider } from "@tanstack/react-router";
import type { createAppRouter } from "./router.tsx";

export function App({ router }: { router: ReturnType<typeof createAppRouter> }) {
  return <RouterProvider router={router} />;
}
