import { createFileRoute } from "@tanstack/react-router";
import type { z } from "zod";
import {
	apiError,
	apiSuccess,
	validateApiKey,
} from "../../../lib/api/api-auth";
import { spaetiSchema, storeSpaeti } from "../../../lib/api/spaeti-service";

export const Route = createFileRoute("/api/spaetis/")({
	server: {
		handlers: {
			/**
			 * POST /api/spaetis
			 *
			 * Creates a new Späti.
			 *
			 * Headers:
			 *   Authorization: Bearer <API_KEY>
			 *   Content-Type: application/json
			 *
			 * Body:
			 * {
			 *   "name": "Späti Name",
			 *   "address": "Street 123, Berlin",
			 *   "googleMapsUrl": "https://maps.app.goo.gl/...",
			 *   "seating": "YES" | "NO",
			 *   "hasToilet": "YES" | "NO",
			 *   "priceLevel": "$" | "$$" | "$$$",
			 *   "payment": "CARD" | "CASH_ONLY",
			 *   "latitude": 52.5200,
			 *   "longitude": 13.4050,
			 *   "neighborhood": "Kreuzberg",  // optional
			 *   "zipCode": "10999",           // optional
			 *   "reviewedAt": null            // optional, ISO datetime
			 * }
			 *
			 * Response:
			 * {
			 *   "id": 1
			 * }
			 */
			POST: async ({ request }) => {
				// Validate API key
				const authResult = validateApiKey();
				if (!authResult.valid) {
					const status = authResult.error.includes("Invalid") ? 401 : 400;
					return apiError(authResult.error, status);
				}

				// Parse and validate request body
				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return apiError("Invalid JSON body", 400);
				}

				const parseResult = spaetiSchema.safeParse(body);
				if (!parseResult.success) {
					const errors = parseResult.error.issues.map(
						(issue: z.ZodIssue) => `${issue.path.join(".")}: ${issue.message}`,
					) as string[];
					return apiError(`Validation failed: ${errors.join("; ")}`, 400);
				}

				// Ingest the data
				try {
					const result = await storeSpaeti(parseResult.data);
					return apiSuccess({ id: result }, 201);
				} catch (error) {
					console.error("Error storing Späti:", error);
					return apiError("Failed to store Späti", 500);
				}
			},
		},
	},
});
