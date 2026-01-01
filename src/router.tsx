import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import ReactGA from "react-ga4";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Create a new router instance
export const getRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createRouter({
		routeTree,
		context: {
			...rqContext,
		},

		defaultPreload: "intent",
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	// Initialize ReactGA and subscribe to route changes (client-side only)
	if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
		console.log("[GA] Initializing with measurement ID:", GA_MEASUREMENT_ID);
		try {
			ReactGA.initialize(GA_MEASUREMENT_ID);
		} catch (error) {
			console.error("[GA] Initialize error:", error);
		}

		router.history.subscribe((url) => {
			const path = url.location.pathname + url.location.search;
			console.log("[GA] Sending pageview:", path);
			try {
				ReactGA.send({ hitType: "pageview", page: path });
			} catch (error) {
				console.error("[GA] Pageview error:", error);
			}
		});
	}

	return router;
};
