CREATE TABLE "itinerary_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"destination_id" integer NOT NULL,
	"day_number" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "destinations" ADD COLUMN "duration" text;--> statement-breakpoint
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;