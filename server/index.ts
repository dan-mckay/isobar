import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";
import { openDatabase } from "./db/database.ts";
import { createSqliteLocationStore } from "./locations/sqliteStore.ts";
import { createOfflineProvider } from "./provider/offline.ts";
import { createOpenMeteoProvider } from "./provider/openMeteo.ts";

const port = Number(process.env.PORT ?? 3000);
const offline = process.env.ISOBAR_OFFLINE === "1";

const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
mkdirSync(dataDir, { recursive: true });
const database = await openDatabase(`${dataDir}isobar.sqlite`);

const app = createApp({
  provider: offline ? createOfflineProvider() : createOpenMeteoProvider(),
  locations: createSqliteLocationStore(database),
});

serve({ fetch: app.fetch, port }, (info) => {
  const mode = offline ? " (offline: answering from fixtures)" : "";
  console.log(`API listening on http://localhost:${info.port}${mode}`);
});
