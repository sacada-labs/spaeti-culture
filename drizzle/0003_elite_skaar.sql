CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"googleMapsUrl" text NOT NULL,
	"seating" "seating" DEFAULT 'UNKNOWN' NOT NULL,
	"has_toilet" "has_toilet" DEFAULT 'UNKNOWN' NOT NULL,
	"price_level" "price_level" NOT NULL,
	"payment" "payment" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
