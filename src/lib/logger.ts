import { createMiddleware } from "@tanstack/react-start";

export const loggerMiddleware = createMiddleware().server(async ({ next }) => {
	const requestId = Math.random().toString(36).substring(2, 9);
	console.log(`[ServerFn] [${requestId}] Started`);
	const start = Date.now();

	try {
		const result = await next();
		const duration = Date.now() - start;
		console.log(`[ServerFn] [${requestId}] Success - ${duration}ms`);
		return result;
	} catch (error) {
		const duration = Date.now() - start;
		console.error(`[ServerFn] [${requestId}] Error - ${duration}ms:`, error);
		throw error;
	}
});
