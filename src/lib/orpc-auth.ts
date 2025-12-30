import type { Middleware } from "@orpc/server";
import { ORPCError } from "@orpc/server";

// Basic auth credentials - in production, use environment variables
const VALID_USERNAME = process.env.API_USERNAME || "admin";
const VALID_PASSWORD = process.env.API_PASSWORD || "password";

export interface AuthContext {
	headers: Headers;
}

export const basicAuthMiddleware: Middleware<
	AuthContext,
	AuthContext,
	unknown,
	unknown,
	Record<never, never>,
	Record<never, never>
> = async ({ context, next }) => {
	const authHeader = context.headers.get("Authorization");

	if (!authHeader || !authHeader.startsWith("Basic ")) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Missing or invalid Authorization header",
		});
	}

	// Decode the Base64-encoded credentials
	const base64Credentials = authHeader.split(" ")[1];
	const credentials = atob(base64Credentials);
	const [username, password] = credentials.split(":");

	// Validate credentials
	if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Invalid username or password",
		});
	}

	// Proceed to the next middleware or handler
	return next();
};
