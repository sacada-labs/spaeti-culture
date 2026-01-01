ALTER TABLE "spatis" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "spatis" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "spatis" ALTER COLUMN "neighborhood" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "spatis" ALTER COLUMN "zipCode" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "spatis" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "seating" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "has_toilet" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "spatis" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "spatis" ADD COLUMN "reviewed_at" timestamp;