import { sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { spatis } from "../db/schema.ts";

// Berlin boundaries (approximate)
const BERLIN_LAT_MIN = 52.3383;
const BERLIN_LAT_MAX = 52.6755;
const BERLIN_LON_MIN = 13.0883;
const BERLIN_LON_MAX = 13.7614;

// Berlin neighborhoods with their approximate coordinates and zip codes
const neighborhoods = [
	{ name: "Mitte", zipCode: "10115", lat: 52.52, lon: 13.405 },
	{ name: "Prenzlauer Berg", zipCode: "10405", lat: 52.54, lon: 13.42 },
	{ name: "Friedrichshain", zipCode: "10243", lat: 52.51, lon: 13.45 },
	{ name: "Kreuzberg", zipCode: "10961", lat: 52.5, lon: 13.39 },
	{ name: "Neukölln", zipCode: "12043", lat: 52.48, lon: 13.43 },
	{ name: "Charlottenburg", zipCode: "10623", lat: 52.52, lon: 13.3 },
	{ name: "Wedding", zipCode: "13347", lat: 52.55, lon: 13.37 },
	{ name: "Moabit", zipCode: "10553", lat: 52.53, lon: 13.34 },
	{ name: "Schöneberg", zipCode: "10781", lat: 52.49, lon: 13.35 },
	{ name: "Tempelhof", zipCode: "12099", lat: 52.47, lon: 13.38 },
	{ name: "Steglitz", zipCode: "12163", lat: 52.46, lon: 13.32 },
	{ name: "Zehlendorf", zipCode: "14169", lat: 52.43, lon: 13.26 },
	{ name: "Lichtenberg", zipCode: "10365", lat: 52.52, lon: 13.48 },
	{ name: "Pankow", zipCode: "13187", lat: 52.57, lon: 13.41 },
	{ name: "Reinickendorf", zipCode: "13407", lat: 52.58, lon: 13.33 },
];

// Common Späti name patterns
const spatiNames = [
	"Späti",
	"Spätkauf",
	"Späti am Eck",
	"Eckkneipe",
	"Kiosk",
	"Büdchen",
	"Trinkhalle",
	"Getränkemarkt",
	"Späti 24",
	"Nachtshop",
	"Corner Shop",
	"Späti Express",
	"Spätkauf Express",
	"Späti & More",
	"Quick Späti",
];

// Street name patterns
const streetNames = [
	"Oranienstraße",
	"Warschauer Straße",
	"Kottbusser Damm",
	"Sonnenallee",
	"Bergmannstraße",
	"Schönhauser Allee",
	"Prenzlauer Allee",
	"Karl-Marx-Allee",
	"Torstraße",
	"Brunnenstraße",
	"Kastanienallee",
	"Revaler Straße",
	"Boxhagener Straße",
	"Weserstraße",
	"Pannierstraße",
	"Flughafenstraße",
	"Tempelhofer Damm",
	"Schloßstraße",
	"Kurfürstendamm",
	"Friedrichstraße",
];

const seatingOptions = ["YES", "NO"] as const;
const hasToiletOptions = ["YES", "NO"] as const;
const priceLevelOptions = ["$$$", "$$", "$"] as const;
const paymentOptions = ["CARD", "CASH_ONLY"] as const;

// Generate random number between min and max
function randomBetween(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

// Generate random point near a neighborhood center with some variance
function randomPointNearNeighborhood(
	centerLat: number,
	centerLon: number,
	variance = 0.02,
) {
	const lat = randomBetween(centerLat - variance, centerLat + variance);
	const lon = randomBetween(centerLon - variance, centerLon + variance);
	// Clamp to Berlin boundaries
	return {
		lat: Math.max(BERLIN_LAT_MIN, Math.min(BERLIN_LAT_MAX, lat)),
		lon: Math.max(BERLIN_LON_MIN, Math.min(BERLIN_LON_MAX, lon)),
	};
}

// Generate random Späti data
function generateSpati() {
	const neighborhood =
		neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
	const point = randomPointNearNeighborhood(
		neighborhood.lat,
		neighborhood.lon,
		0.015,
	);

	const streetName =
		streetNames[Math.floor(Math.random() * streetNames.length)];
	const streetNumber = Math.floor(Math.random() * 200) + 1;
	const address = `${streetName} ${streetNumber}`;

	const nameBase = spatiNames[Math.floor(Math.random() * spatiNames.length)];
	const name = Math.random() > 0.7 ? `${nameBase} ${streetName}` : nameBase;

	return {
		name,
		address,
		neighborhood: neighborhood.name,
		zipCode: neighborhood.zipCode,
		location: sql`ST_SetSRID(ST_MakePoint(${point.lon}, ${point.lat}), 4326)`,
		googleMapsUrl: "https://maps.app.goo.gl/Jy5WtQzyBe3QXens7",
		seating: seatingOptions[Math.floor(Math.random() * seatingOptions.length)],
		hasToilet:
			hasToiletOptions[Math.floor(Math.random() * hasToiletOptions.length)],
		priceLevel:
			priceLevelOptions[Math.floor(Math.random() * priceLevelOptions.length)],
		payment: paymentOptions[Math.floor(Math.random() * paymentOptions.length)],
		reviewedAt: new Date(),
	};
}

async function seed() {
	console.log("🌱 Starting database seed...");

	try {
		// Generate 50 Spätis
		const spatisData = Array.from({ length: 100 }, () => generateSpati());

		console.log(`📦 Inserting ${spatisData.length} Spätis...`);

		// Insert in batches of 10
		for (let i = 0; i < spatisData.length; i += 10) {
			const batch = spatisData.slice(i, i + 10);
			await db.insert(spatis).values(batch);
			console.log(
				`✅ Inserted batch ${Math.floor(i / 10) + 1}/${Math.ceil(spatisData.length / 10)}`,
			);
		}

		console.log("✨ Seed completed successfully!");
		console.log(`📊 Total Spätis in database: ${spatisData.length}`);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	}
}

// Run seed when this file is executed directly
seed()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

export { seed };
