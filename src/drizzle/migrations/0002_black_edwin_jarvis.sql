ALTER TABLE "monitors" DROP CONSTRAINT "monitors_url_unique";--> statement-breakpoint
ALTER TABLE "monitorStatus" ADD COLUMN "url" varchar(255);