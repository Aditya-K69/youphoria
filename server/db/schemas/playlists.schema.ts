import { pgTable, integer, text, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const playlists = pgTable(
  "playlists",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    /**
     * User-defined playlist name.
     */
    name: text("name").notNull(),

    /**
     * Optional description.
     */
    description: text("description"),

    /**
     * Optional custom artwork.
     */
    coverPath: text("cover_path"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("playlists_name_not_empty_chk", sql`length(trim(${table.name})) > 0`),
  ],
);
