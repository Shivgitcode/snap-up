CREATE TABLE IF NOT EXISTS "monitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar(255),
	"time" integer,
	"name" varchar(255),
	CONSTRAINT "monitors_url_unique" UNIQUE("url"),
	CONSTRAINT "monitors_name_unique" UNIQUE("name")
);
