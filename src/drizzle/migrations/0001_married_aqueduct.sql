DROP TABLE "monitorStatus";--> statement-breakpoint
ALTER TABLE "monitors" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "monitors" ADD COLUMN "statuscode" integer;