import { createIsomorphicFn } from "@tanstack/react-start";

/**
 * Google Analytics 4 utilities
 * Only loads and tracks in production when VITE_GA_MEASUREMENT_ID is set
 */

declare global {
	interface Window {
		gtag?: (
			command: "config" | "event" | "js" | "set",
			targetId: string | Date,
			config?: Record<string, unknown>,
		) => void;
		dataLayer?: unknown[];
	}
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const shouldLoadGA = createIsomorphicFn()
	.client(() => {
		return (
			typeof window !== "undefined" &&
			!!GA_MEASUREMENT_ID &&
			import.meta.env.PROD
		);
	})
	.server(() => {
		return !!GA_MEASUREMENT_ID && import.meta.env.PROD;
	});

export const trackPageView = (path: string): void => {
    console.log("trackPageView", path);
	if (!shouldLoadGA() || !window.gtag) {
		return;
	}

	window.gtag("config", GA_MEASUREMENT_ID, {
		page_path: path,
	});
};

export const trackCustomEvent = (eventName: string): void => {
    console.log("trackCustomEvent", eventName);
	if (!shouldLoadGA() || !window.gtag) {
		return;
	}

	window.gtag("event", eventName);
};
