CREATE TYPE "public"."has_toilet" AS ENUM('YES', 'NO', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."payment" AS ENUM('CARD', 'CASH_ONLY');--> statement-breakpoint
CREATE TYPE "public"."price_level" AS ENUM('$$$', '$$', '$');--> statement-breakpoint
CREATE TYPE "public"."seating" AS ENUM('INDOOR', 'OUTDOOR', 'BOTH', 'UNKNOWN');--> statement-breakpoint
CREATE TABLE "spatis" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"neighborhood" text NOT NULL,
	"zipCode" text NOT NULL,
	"location" geometry(point) NOT NULL,
	"seating" "seating" DEFAULT 'UNKNOWN',
	"has_toilet" "has_toilet" DEFAULT 'UNKNOWN',
	"price_level" "price_level" NOT NULL,
	"payment" "payment" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
