import { z } from "zod";
import { db } from "../../db";
import {
	hasToiletEnum,
	paymentEnum,
	priceLevelEnum,
	seatingEnum,
	spatis,
} from "../../db/schema";

/**
 * Schema for a single Späti record
 */
export const spaetiSchema = z.object({
	name: z.string().min(1).max(255),
	address: z.string().min(1).max(500),
	googleMapsUrl: z.url(),
	seating: z.enum(seatingEnum.enumValues),
	hasToilet: z.enum(hasToiletEnum.enumValues),
	priceLevel: z.enum(priceLevelEnum.enumValues),
	payment: z.enum(paymentEnum.enumValues),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),

	// Optional fields
	neighborhood: z.string().max(255).optional().nullable(),
	zipCode: z.string().max(20).optional().nullable(),
	reviewedAt: z.string().datetime().optional().nullable(),
});

export async function storeSpaeti(
	spaeti: z.infer<typeof spaetiSchema>,
): Promise<number> {
	try {
		const values = {
			...spaeti,
			reviewedAt: spaeti.reviewedAt ? new Date(spaeti.reviewedAt) : null,
			updatedAt: new Date(),
		};

		const inserted = await db
			.insert(spatis)
			.values(values)
			.returning({ id: spatis.id });

		return inserted[0].id;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to store Späti",
		);
	}
}
