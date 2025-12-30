import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import { router } from "../../lib/orpc-router";

const handler = new OpenAPIHandler(router, {
	plugins: [
		new OpenAPIReferencePlugin({
			docsProvider: "scalar",
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "Sit-in Späti API",
					version: "1.0.0",
					description: "API for managing Berlin Spätis (convenience stores)",
				},
				components: {
					securitySchemes: {
						BasicAuth: {
							type: "http",
							scheme: "basic",
							description: "Basic Authentication using username and password",
						},
					},
				},
				security: [
					{
						BasicAuth: [],
					},
				],
			},
		}),
	],
});

export const Route = createFileRoute("/api/docs/$")({
	server: {
		handlers: {
			ANY: async ({ request }) => {
				const { matched, response } = await handler.handle(request, {
					prefix: "/api/docs",
					context: {
						headers: request.headers,
					},
				});

				if (matched) {
					return response;
				}

				return new Response("Not Found", { status: 404 });
			},
		},
	},
});
