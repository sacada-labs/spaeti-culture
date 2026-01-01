import { createMiddleware } from "@tanstack/react-start";

export const loggerMiddleware = createMiddleware().server(async ({ next }) => {
	return next();
});
