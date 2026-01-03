import { getRequestHeaders } from "@tanstack/react-start/server";

/**
 * Validates the API key from the Authorization header.
 * Expected format: "Bearer <API_KEY>"
 */
export function validateApiKey():
	| { valid: true }
	| { valid: false; error: string } {
	const expectedApiKey = process.env.API_KEY;

	if (!expectedApiKey) {
		console.error("API_KEY not set in environment");
		return { valid: false, error: "Server configuration error" };
	}

	const headers = getRequestHeaders();
	if (!headers) {
		return { valid: false, error: "Missing request headers" };
	}

	const authHeader = headers.get("Authorization");
	if (!authHeader) {
		return { valid: false, error: "Missing Authorization header" };
	}

	const [scheme, token] = authHeader.split(" ");
	if (scheme !== "Bearer" || !token) {
		return {
			valid: false,
			error: "Invalid Authorization format. Use: Bearer <token>",
		};
	}

	if (token !== expectedApiKey) {
		return { valid: false, error: "Invalid API key" };
	}

	return { valid: true };
}

/**
 * Creates an error response with proper status code
 */
export function apiError(message: string, status: 400 | 401 | 403 | 500 = 400) {
	return Response.json({ success: false, error: message }, { status });
}

/**
 * Creates a success response
 */
export function apiSuccess<T>(data: T, status: 200 | 201 = 200) {
	return Response.json({ success: true, ...data }, { status });
}
