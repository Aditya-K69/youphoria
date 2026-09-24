import {
  pgTable,
  integer,
  smallint,
  bigint,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { albums } from "./albums.schema";

export const songs = pgTable(
  "songs",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    /**
     * Every song must belong to exactly one album.
     */
    albumId: integer("album_id")
      .notNull()
      .references(() => albums.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * Physical file path relative to MEDIA_ROOT.
     *
     * Example:
     * "MBDTF/01. Dark Fantasy.flac"
     */
    relativePath: text("relative_path").notNull(),

    // -------------------------
    // Embedded metadata
    // -------------------------

    /**
     * Required application-level title.
     *
     * Your parser should fall back to the filename when the
     * embedded TITLE tag is missing.
     */
    title: text("title").notNull(),

    artist: text("artist"),

    /**
     * Embedded ALBUM tag.
     *
     * This is intentionally separate from albums.folderName.
     */
    albumName: text("album_name"),

    albumArtist: text("album_artist"),

    trackNumber: smallint("track_number"),
    trackTotal: smallint("track_total"),

    discNumber: smallint("disc_number"),
    discTotal: smallint("disc_total"),

    year: smallint("year"),

    /**
     * Preserved as text because music metadata dates are not
     * guaranteed to conform to a strict SQL DATE.
     *
     * Examples:
     * "2010"
     * "2010-01-01"
     */
    date: text("date"),

    genre: text("genre").array(),

    isrc: text("isrc").array(),

    label: text("label").array(),

    producer: text("producer").array(),

    // -------------------------
    // Audio properties
    // -------------------------

    /**
     * Stored as milliseconds instead of floating-point seconds.
     */
    durationMs: integer("duration_ms"),

    /**
     * Example: "FLAC", "MPEG", "MP4"
     */
    format: text("format"),

    /**
     * Example: "FLAC", "MP3", "AAC"
     */
    codec: text("codec"),

    /**
     * Example: "FLAC", "MPEG-4"
     */
    container: text("container"),

    /**
     * Bits per second.
     */
    bitrate: integer("bitrate"),

    /**
     * Example: 44100, 48000, 96000
     */
    sampleRate: integer("sample_rate"),

    /**
     * Example: 16, 24
     */
    bitsPerSample: smallint("bits_per_sample"),

    /**
     * Example:
     * 1 = mono
     * 2 = stereo
     */
    channels: smallint("channels"),

    lossless: boolean("lossless"),

    // -------------------------
    // Filesystem state
    // -------------------------

    /**
     * Whether the file currently exists.
     *
     * Scanner sets this during a library refresh.
     */
    isAvailable: boolean("is_available").default(true).notNull(),

    /**
     * Physical file size in bytes.
     */
    fileSize: bigint("file_size", {
      mode: "number",
    }).notNull(),

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
    /**
     * A relative path uniquely identifies one physical file.
     */
    uniqueIndex("songs_relative_path_uidx").on(table.relativePath),

    /**
     * Used when retrieving all songs for an album.
     */
    index("songs_album_id_idx").on(table.albumId),

    check(
      "songs_relative_path_not_empty_chk",
      sql`length(trim(${table.relativePath})) > 0`,
    ),

    check("songs_title_not_empty_chk", sql`length(trim(${table.title})) > 0`),

    check(
      "songs_duration_nonnegative_chk",
      sql`${table.durationMs} IS NULL OR ${table.durationMs} >= 0`,
    ),

    check("songs_file_size_nonnegative_chk", sql`${table.fileSize} >= 0`),

    check(
      "songs_track_number_positive_chk",
      sql`${table.trackNumber} IS NULL OR ${table.trackNumber} > 0`,
    ),

    check(
      "songs_track_total_positive_chk",
      sql`${table.trackTotal} IS NULL OR ${table.trackTotal} > 0`,
    ),

    check(
      "songs_disc_number_positive_chk",
      sql`${table.discNumber} IS NULL OR ${table.discNumber} > 0`,
    ),

    check(
      "songs_disc_total_positive_chk",
      sql`${table.discTotal} IS NULL OR ${table.discTotal} > 0`,
    ),

    check(
      "songs_channels_positive_chk",
      sql`${table.channels} IS NULL OR ${table.channels} > 0`,
    ),

    check(
      "songs_sample_rate_positive_chk",
      sql`${table.sampleRate} IS NULL OR ${table.sampleRate} > 0`,
    ),

    check(
      "songs_bits_per_sample_positive_chk",
      sql`${table.bitsPerSample} IS NULL OR ${table.bitsPerSample} > 0`,
    ),

    check(
      "songs_bitrate_nonnegative_chk",
      sql`${table.bitrate} IS NULL OR ${table.bitrate} >= 0`,
    ),
  ],
);
