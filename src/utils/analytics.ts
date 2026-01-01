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

/**
 * Check if Google Analytics should be loaded
 */
export function shouldLoadGA(): boolean {
	return (
		typeof window !== "undefined" && !!GA_MEASUREMENT_ID && import.meta.env.PROD
	);
}

/**
 * Initialize Google Analytics
 */
export function initGA(): void {
	if (!shouldLoadGA()) {
		return;
	}

	// Initialize dataLayer
	window.dataLayer = window.dataLayer || [];
	window.gtag = (...args: unknown[]) => {
		window.dataLayer?.push(args);
	};

	// Set initial timestamp
	window.gtag("js", new Date());
	window.gtag("config", GA_MEASUREMENT_ID, {
		send_page_view: false, // We'll track page views manually
	});
}

/**
 * Track a page view
 */
export function trackPageView(path?: string): void {
	if (!shouldLoadGA() || !window.gtag) {
		return;
	}

	window.gtag("config", GA_MEASUREMENT_ID, {
		page_path: path || window.location.pathname + window.location.search,
	});
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string): void {
	if (!shouldLoadGA() || !window.gtag) {
		return;
	}

	window.gtag("event", eventName);
}
