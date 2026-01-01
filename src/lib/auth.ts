import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";

const AUTH_COOKIE_NAME = "backoffice_auth";
const SESSION_VALUE = "authenticated";

export const loginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	if (!headers) {
		throw new Error("Unauthorized");
	}

	const cookieHeader = headers.get("Cookie") || "";
	const cookies = cookieHeader
		.split(";")
		.reduce((acc: Record<string, string>, cookie: string) => {
			const [name, value] = cookie.trim().split("=");
			if (name && value) acc[name] = value;
			return acc;
		}, {});

	if (cookies[AUTH_COOKIE_NAME] !== SESSION_VALUE) {
		throw new Error("Unauthorized");
	}

	return next();
});

export const login = createServerFn()
	.inputValidator(loginSchema)
	.handler(async ({ data }) => {
		const { username, password } = data;

		const expectedUsername = process.env.BACKOFFICE_USERNAME;
		const expectedPassword = process.env.BACKOFFICE_PASSWORD;

		if (!expectedUsername || !expectedPassword) {
			console.error(
				"BACKOFFICE_USERNAME or BACKOFFICE_PASSWORD not set in environment",
			);
			throw new Error("Server configuration error");
		}

		if (username === expectedUsername && password === expectedPassword) {
			const isProd = process.env.NODE_ENV === "production";
			const cookieValue = `${AUTH_COOKIE_NAME}=${SESSION_VALUE}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${isProd ? "; Secure" : ""}`;

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Set-Cookie": cookieValue,
				},
			});
		}

		throw new Error("Invalid credentials");
	});

export const logout = createServerFn()
	.middleware([authMiddleware])
	.handler(async () => {
		const cookieValue = `${AUTH_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Set-Cookie": cookieValue,
			},
		});
	});

export const checkAuth = createServerFn()
	.middleware([authMiddleware])
	.handler(async () => {
		return { authenticated: true };
	});

export const backofficeBeforeLoad = async () => {
	try {
		await checkAuth();
	} catch (_error) {
		throw redirect({ to: "/backoffice/login" });
	}
};
