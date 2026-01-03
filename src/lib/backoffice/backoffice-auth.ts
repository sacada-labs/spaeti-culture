import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";
import { loggerMiddleware } from "../logger";

const AUTH_COOKIE_NAME = "backoffice_auth";

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;
	if (!secret) {
		throw new Error("AUTH_SECRET not set in environment");
	}
	return new TextEncoder().encode(secret);
}

async function generateToken(): Promise<string> {
	return await new SignJWT({})
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("7d")
		.sign(getSecretKey());
}

async function verifyToken(token: string): Promise<boolean> {
	try {
		await jwtVerify(token, getSecretKey());
		return true;
	} catch {
		return false;
	}
}

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

	const token = cookies[AUTH_COOKIE_NAME];
	if (!token || !(await verifyToken(token))) {
		throw new Error("Unauthorized");
	}

	return next();
});

export const login = createServerFn()
	.middleware([loggerMiddleware])
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
			const token = await generateToken();
			const isProd = process.env.NODE_ENV === "production";
			const cookieValue = `${AUTH_COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${isProd ? "; Secure" : ""}`;

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
	.middleware([loggerMiddleware, authMiddleware])
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
	.middleware([loggerMiddleware, authMiddleware])
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
