CREATE TABLE "storageinfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userid" varchar,
	"storageUsed" bigint DEFAULT 0,
	"storageCapacity" bigint DEFAULT 1073741824,
	"storage_used_percentage" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"path" varchar NOT NULL,
	"size" integer NOT NULL,
	"type" varchar NOT NULL,
	"file_url" varchar NOT NULL,
	"thumbnail_url" varchar,
	"userid" varchar NOT NULL,
	"file_id" varchar,
	"parent_id" uuid,
	"is_folder" boolean DEFAULT false NOT NULL,
	"is_starred" boolean DEFAULT false NOT NULL,
	"is_trash" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "files_userid_unique" UNIQUE("userid")
);
--> statement-breakpoint
ALTER TABLE "storageinfo" ADD CONSTRAINT "storageinfo_userid_files_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."files"("userid") ON DELETE no action ON UPDATE no action;