import { Hono } from "hono";
import { z } from "zod";

const healthSchema = z.object({
  status: z.literal("ok"),
  time: z.iso.datetime(),
});

const app = new Hono();

const routes = app.get("/api/health", (c) => {
  const body = healthSchema.parse({
    status: "ok",
    time: new Date().toISOString(),
  });
  return c.json(body);
});

export type AppType = typeof routes;
export { app };
