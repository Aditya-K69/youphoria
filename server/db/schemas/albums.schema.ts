import {
  pgTable,
  integer,
  text,
  timestamp,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const albums = pgTable(
  "albums",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    /**
     * Exact directory name under MEDIA_ROOT.
     *
     * Example:
     * "My Beautiful Dark Twisted Fantasy [E]"
     */
    folderName: text("folder_name").notNull(),

    /**
     * Path relative to MEDIA_ROOT.
     *
     * Example:
     * "My Beautiful Dark Twisted Fantasy [E]"
     */
    relativePath: text("relative_path").notNull(),

    /**
     * Application-managed cover-art path.
     * Nullable because artwork may not exist.
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
    uniqueIndex("albums_relative_path_uidx").on(table.relativePath),

    check(
      "albums_folder_name_not_empty_chk",
      sql`length(trim(${table.folderName})) > 0`,
    ),

    check(
      "albums_relative_path_not_empty_chk",
      sql`length(trim(${table.relativePath})) > 0`,
    ),
  ],
);
