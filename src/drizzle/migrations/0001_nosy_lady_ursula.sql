CREATE TABLE IF NOT EXISTS "monitorRelations" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"monitorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitorStatus" (
	"id" text PRIMARY KEY NOT NULL,
	"statuscode" integer,
	"status" text
);
--> statement-breakpoint
ALTER TABLE "monitors" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "monitors" ADD COLUMN "latestCheck" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitorRelations" ADD CONSTRAINT "monitorRelations_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitorRelations" ADD CONSTRAINT "monitorRelations_monitorId_monitors_id_fk" FOREIGN KEY ("monitorId") REFERENCES "public"."monitors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
