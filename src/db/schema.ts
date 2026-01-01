import {
	geometry,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const seatingEnum = pgEnum("seating", ["YES", "NO"]);
export const priceLevelEnum = pgEnum("price_level", ["$$$", "$$", "$"]);
export const paymentEnum = pgEnum("payment", ["CARD", "CASH_ONLY"]);
export const hasToiletEnum = pgEnum("has_toilet", ["YES", "NO"]);

export const spatis = pgTable("spatis", {
	id: serial().primaryKey(),
	name: text(),
	address: text(),
	neighborhood: text(),
	zipCode: text(),
	location: geometry("location", {
		type: "point",
		mode: "xy",
		srid: 4326,
	}),
	googleMapsUrl: text("google_maps_url"),
	seating: seatingEnum("seating").notNull(),
	hasToilet: hasToiletEnum("has_toilet").notNull(),
	priceLevel: priceLevelEnum("price_level").notNull(),
	payment: paymentEnum("payment").notNull(),
	reviewedAt: timestamp("reviewed_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
