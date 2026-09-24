CREATE TABLE "albums" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "albums_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"folder_name" text NOT NULL,
	"relative_path" text NOT NULL,
	"cover_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "albums_folder_name_not_empty_chk" CHECK (length(trim("folder_name")) > 0),
	CONSTRAINT "albums_relative_path_not_empty_chk" CHECK (length(trim("relative_path")) > 0)
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "playlists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"cover_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "playlists_name_not_empty_chk" CHECK (length(trim("name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "songs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"album_id" integer NOT NULL,
	"relative_path" text NOT NULL,
	"title" text NOT NULL,
	"artist" text,
	"album_name" text,
	"album_artist" text,
	"track_number" smallint,
	"track_total" smallint,
	"disc_number" smallint,
	"disc_total" smallint,
	"year" smallint,
	"date" text,
	"genre" text[],
	"isrc" text[],
	"label" text[],
	"producer" text[],
	"duration_ms" integer,
	"format" text,
	"codec" text,
	"container" text,
	"bitrate" integer,
	"sample_rate" integer,
	"bits_per_sample" smallint,
	"channels" smallint,
	"lossless" boolean,
	"is_available" boolean DEFAULT true NOT NULL,
	"file_size" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "songs_relative_path_not_empty_chk" CHECK (length(trim("relative_path")) > 0),
	CONSTRAINT "songs_title_not_empty_chk" CHECK (length(trim("title")) > 0),
	CONSTRAINT "songs_duration_nonnegative_chk" CHECK ("duration_ms" IS NULL OR "duration_ms" >= 0),
	CONSTRAINT "songs_file_size_nonnegative_chk" CHECK ("file_size" >= 0),
	CONSTRAINT "songs_track_number_positive_chk" CHECK ("track_number" IS NULL OR "track_number" > 0),
	CONSTRAINT "songs_track_total_positive_chk" CHECK ("track_total" IS NULL OR "track_total" > 0),
	CONSTRAINT "songs_disc_number_positive_chk" CHECK ("disc_number" IS NULL OR "disc_number" > 0),
	CONSTRAINT "songs_disc_total_positive_chk" CHECK ("disc_total" IS NULL OR "disc_total" > 0),
	CONSTRAINT "songs_channels_positive_chk" CHECK ("channels" IS NULL OR "channels" > 0),
	CONSTRAINT "songs_sample_rate_positive_chk" CHECK ("sample_rate" IS NULL OR "sample_rate" > 0),
	CONSTRAINT "songs_bits_per_sample_positive_chk" CHECK ("bits_per_sample" IS NULL OR "bits_per_sample" > 0),
	CONSTRAINT "songs_bitrate_nonnegative_chk" CHECK ("bitrate" IS NULL OR "bitrate" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "albums_relative_path_uidx" ON "albums" ("relative_path");--> statement-breakpoint
CREATE UNIQUE INDEX "songs_relative_path_uidx" ON "songs" ("relative_path");--> statement-breakpoint
CREATE INDEX "songs_album_id_idx" ON "songs" ("album_id");--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_album_id_albums_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;