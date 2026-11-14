import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const locations = sqliteTable("locations", {
  /** The geocoder's id for the place, so saving the same place twice finds the existing row. */
  id: integer().primaryKey(),
  name: text().notNull(),
  /** State, province or similar. Null when the geocoder has none. */
  region: text(),
  country: text().notNull(),
  latitude: real().notNull(),
  longitude: real().notNull(),
  timezone: text().notNull(),
  sortOrder: integer("sort_order").notNull(),
});
