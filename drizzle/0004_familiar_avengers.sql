-- Drop defaults first
ALTER TABLE "spatis" ALTER COLUMN "has_toilet" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "spatis" ALTER COLUMN "seating" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "has_toilet" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "seating" DROP DEFAULT;--> statement-breakpoint

-- Convert columns to text temporarily (must do this BEFORE updating values)
ALTER TABLE "spatis" ALTER COLUMN "has_toilet" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "has_toilet" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "spatis" ALTER COLUMN "seating" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "seating" SET DATA TYPE text;--> statement-breakpoint

-- Now update values (columns are text, so we can use any string)
UPDATE "spatis" SET "has_toilet" = 'NO' WHERE "has_toilet" = 'UNKNOWN';--> statement-breakpoint
UPDATE "spatis" SET "seating" = 'YES' WHERE "seating" IN ('INDOOR', 'OUTDOOR', 'BOTH');--> statement-breakpoint
UPDATE "spatis" SET "seating" = 'NO' WHERE "seating" = 'UNKNOWN';--> statement-breakpoint
UPDATE "submissions" SET "has_toilet" = 'NO' WHERE "has_toilet" = 'UNKNOWN';--> statement-breakpoint
UPDATE "submissions" SET "seating" = 'YES' WHERE "seating" IN ('INDOOR', 'OUTDOOR', 'BOTH');--> statement-breakpoint
UPDATE "submissions" SET "seating" = 'NO' WHERE "seating" = 'UNKNOWN';--> statement-breakpoint

-- Drop old enum types
DROP TYPE "public"."has_toilet";--> statement-breakpoint
DROP TYPE "public"."seating";--> statement-breakpoint

-- Create new enum types
CREATE TYPE "public"."has_toilet" AS ENUM('YES', 'NO');--> statement-breakpoint
CREATE TYPE "public"."seating" AS ENUM('YES', 'NO');--> statement-breakpoint

-- Convert columns back to enum types
ALTER TABLE "spatis" ALTER COLUMN "has_toilet" SET DATA TYPE "public"."has_toilet" USING "has_toilet"::"public"."has_toilet";--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "has_toilet" SET DATA TYPE "public"."has_toilet" USING "has_toilet"::"public"."has_toilet";--> statement-breakpoint
ALTER TABLE "spatis" ALTER COLUMN "seating" SET DATA TYPE "public"."seating" USING "seating"::"public"."seating";--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "seating" SET DATA TYPE "public"."seating" USING "seating"::"public"."seating";--> statement-breakpoint

-- Drop description column
ALTER TABLE "spatis" DROP COLUMN "description";--> statement-breakpoint
