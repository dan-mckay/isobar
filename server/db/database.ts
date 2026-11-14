import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { drizzle, type SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { migrate } from "drizzle-orm/sqlite-proxy/migrator";
import * as schema from "./schema.ts";

const MIGRATIONS_FOLDER = fileURLToPath(new URL("./migrations", import.meta.url));

export interface Database {
  orm: SqliteRemoteDatabase<typeof schema>;
  close(): void;
}

/**
 * Opens (creating if needed) the SQLite file at `path`, or an in-memory database for
 * ":memory:", and brings it up to the latest migration.
 *
 * Drizzle's stable release has no driver for Node's built-in `node:sqlite`, so this
 * adapts it through Drizzle's sqlite-proxy driver instead of adding a native addon.
 */
export async function openDatabase(path: string): Promise<Database> {
  const sqlite = new DatabaseSync(path);
  sqlite.exec("PRAGMA foreign_keys = ON");

  const orm = drizzle(
    async (sql, params: SQLInputValue[], method) => {
      const statement = sqlite.prepare(sql);
      if (method === "run") {
        statement.run(...params);
        return { rows: [] };
      }
      statement.setReturnArrays(true);
      if (method === "get") {
        // sqlite-proxy expects the single row itself (or undefined) for `get`.
        return { rows: statement.get(...params) as unknown as unknown[] };
      }
      return { rows: statement.all(...params) };
    },
    { schema },
  );

  await migrate(
    orm,
    async (queries) => {
      sqlite.exec("BEGIN");
      try {
        for (const query of queries) sqlite.exec(query);
        sqlite.exec("COMMIT");
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
    { migrationsFolder: MIGRATIONS_FOLDER },
  );

  return { orm, close: () => sqlite.close() };
}
