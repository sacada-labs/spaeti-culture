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

				if (matched && response) {
					// Read the response body and create a new response with explicit Content-Length
					// This avoids chunked encoding issues with curl
					const body = await response.arrayBuffer();
					const newResponse = new Response(body, {
						status: response.status,
						statusText: response.statusText,
						headers: {
							...Object.fromEntries(response.headers.entries()),
							"Content-Length": body.byteLength.toString(),
						},
					});
					// Explicitly remove Transfer-Encoding to prevent chunked encoding
					newResponse.headers.delete("Transfer-Encoding");
					return newResponse;
				}

				return new Response("Not Found", { status: 404 });
			},
		},
	},
});
