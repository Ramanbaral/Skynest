CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"path" varchar NOT NULL,
	"size" integer NOT NULL,
	"type" varchar NOT NULL,
	"file_url" varchar NOT NULL,
	"thumbnail_url" varchar,
	"user_id" varchar NOT NULL,
	"file_id" varchar,
	"parent_id" uuid,
	"is_folder" boolean DEFAULT false NOT NULL,
	"is_starred" boolean DEFAULT false NOT NULL,
	"is_trash" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
