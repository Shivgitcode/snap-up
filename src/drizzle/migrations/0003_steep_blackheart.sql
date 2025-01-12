CREATE TABLE IF NOT EXISTS "globalUrls" (
	"id" text PRIMARY KEY NOT NULL,
	"url" varchar(255),
	"lastStatusCode" integer,
	"lastCheckTime" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"activeMonitorCount" integer DEFAULT 0,
	CONSTRAINT "globalUrls_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitorHistory" (
	"id" text PRIMARY KEY NOT NULL,
	"urlId" text NOT NULL,
	"statusCode" integer,
	"responseTime" integer,
	"checkedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userMonitors" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"urlId" text NOT NULL,
	"name" varchar(255),
	"checkInterval" integer NOT NULL,
	"isActive" boolean DEFAULT true,
	"isPaused" boolean DEFAULT false,
	"lastNotificationSent" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"deletedAt" timestamp
);
--> statement-breakpoint
DROP TABLE "monitorRelations";--> statement-breakpoint
DROP TABLE "monitors";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitorHistory" ADD CONSTRAINT "monitorHistory_urlId_globalUrls_id_fk" FOREIGN KEY ("urlId") REFERENCES "public"."globalUrls"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userMonitors" ADD CONSTRAINT "userMonitors_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userMonitors" ADD CONSTRAINT "userMonitors_urlId_globalUrls_id_fk" FOREIGN KEY ("urlId") REFERENCES "public"."globalUrls"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
