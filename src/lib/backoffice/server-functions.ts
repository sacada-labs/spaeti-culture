import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import {
	hasToiletEnum,
	paymentEnum,
	priceLevelEnum,
	seatingEnum,
	spatis,
} from "../../db/schema";
import { authMiddleware } from "../auth";

export const spatiSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	address: z.string().min(1),
	neighborhood: z.string().optional(),
	zipCode: z.string().optional(),
	googleMapsUrl: z.string().url(),
	seating: z.enum(seatingEnum.enumValues),
	hasToilet: z.enum(hasToiletEnum.enumValues),
	priceLevel: z.enum(priceLevelEnum.enumValues),
	payment: z.enum(paymentEnum.enumValues),
	longitude: z.number(),
	latitude: z.number(),
	reviewedAt: z.string().nullable().optional(),
});

export const getAdminSpatis = createServerFn()
	.middleware([authMiddleware])
	.handler(async () => {
		return db.select().from(spatis).orderBy(desc(spatis.createdAt));
	});

export const getAdminSpatiById = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(z.coerce.number().int().positive())
	.handler(async ({ data: id }) => {
		const result = await db.select().from(spatis).where(eq(spatis.id, id));
		return result[0];
	});

export const upsertSpati = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(spatiSchema)
	.handler(async ({ data }) => {
		const { id, latitude, longitude, reviewedAt, ...rest } = data;

		const values = {
			...rest,
			location: { x: longitude, y: latitude },
			reviewedAt: reviewedAt ? new Date(reviewedAt) : null,
			updatedAt: new Date(),
		};

		if (id) {
			await db.update(spatis).set(values).where(eq(spatis.id, id));
			return { success: true, id };
		} else {
			const result = await db
				.insert(spatis)
				.values(values)
				.returning({ id: spatis.id });
			return { success: true, id: result[0].id };
		}
	});

export const deleteSpati = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(z.number())
	.handler(async ({ data: id }) => {
		await db.delete(spatis).where(eq(spatis.id, id));
		return { success: true };
	});

export const toggleSpatiReview = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(z.object({ id: z.number(), reviewed: z.boolean() }))
	.handler(async ({ data }) => {
		await db
			.update(spatis)
			.set({ reviewedAt: data.reviewed ? new Date() : null })
			.where(eq(spatis.id, data.id));
		return { success: true };
	});
