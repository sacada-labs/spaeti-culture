import { os } from "@orpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { spatis } from "../db/schema";
import { type AuthContext, basicAuthMiddleware } from "./orpc-auth";

// Procedure to store a new spaeti
const storeSpaeti = os
	.$context<AuthContext>()
	.use(basicAuthMiddleware)
	.meta({
		security: [{ BasicAuth: [] }],
	})
	.input(
		z.object({
			name: z.string().min(1),
			description: z.string().optional(),
			address: z.string().min(1),
			neighborhood: z.string().min(1),
			zipCode: z.string().min(1),
			latitude: z.number(),
			longitude: z.number(),
			seating: z
				.enum(["INDOOR", "OUTDOOR", "BOTH", "UNKNOWN"])
				.default("UNKNOWN"),
			hasToilet: z.enum(["YES", "NO", "UNKNOWN"]).default("UNKNOWN"),
			priceLevel: z.enum(["$", "$$", "$$$"]),
			payment: z.enum(["CARD", "CASH_ONLY"]),
		}),
	)
	.handler(async ({ input }) => {
		const { latitude, longitude, ...rest } = input;
		const [newSpaeti] = await db
			.insert(spatis)
			.values({
				...rest,
				location: sql`ST_MakePoint(${longitude}, ${latitude})`,
			})
			.returning();
		return newSpaeti;
	});

// Procedure to query all spaetis
const getAllSpaetis = os
	.$context<AuthContext>()
	.use(basicAuthMiddleware)
	.meta({
		security: [{ BasicAuth: [] }],
	})
	.handler(async () => {
		const allSpaetis = await db.select().from(spatis);
		return allSpaetis;
	});

export const router = {
	storeSpaeti,
	getAllSpaetis,
};
