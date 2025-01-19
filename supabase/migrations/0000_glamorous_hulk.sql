CREATE TABLE "events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_name" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solves" (
	"solve_id" integer PRIMARY KEY NOT NULL,
	"scramble" text,
	"user_id" text NOT NULL,
	"minutes" integer NOT NULL,
	"seconds" integer NOT NULL,
	"ms" integer NOT NULL,
	"timeRecorded" integer NOT NULL,
	"event_id" text,
	"+2" integer NOT NULL,
	"DNF" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solves" ADD CONSTRAINT "solves_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solves" ADD CONSTRAINT "solves_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "solves" ALTER COLUMN "solveId" SET DATA TYPE serial;