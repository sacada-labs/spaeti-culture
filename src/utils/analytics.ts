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

export function shouldLoadGA(): boolean {
	return (
		typeof window !== "undefined" && !!GA_MEASUREMENT_ID && import.meta.env.PROD
	);
}

export function trackPageView(path?: string): void {
	if (!shouldLoadGA() || !window.gtag) {
		return;
	}

	window.gtag("config", GA_MEASUREMENT_ID, {
		page_path: path || window.location.pathname + window.location.search,
	});
}

export function trackCustomEvent(eventName: string): void {
	if (!shouldLoadGA() || !window.gtag) {
		return;
	}

	window.gtag("event", eventName);
}
