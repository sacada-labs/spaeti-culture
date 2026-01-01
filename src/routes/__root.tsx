import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import { shouldLoadGA, trackPageView } from "../utils/analytics";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Späti Culture | Berlin's Best Late-Night Spots with Seating",
			},
			{
				name: "description",
				content:
					"Find Berlin Spätis with seating, toilets, and card payment. A curated community guide to the city's best late-night convenience stores.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/icon.svg",
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
			},
			...(shouldLoadGA() && GA_MEASUREMENT_ID
				? [
						{
							rel: "preconnect",
							href: "https://www.googletagmanager.com",
						},
						{
							rel: "preconnect",
							href: "https://www.google-analytics.com",
						},
					]
				: []),
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	// GA initialization is now done inline in the <head> script tag

	useEffect(() => {
		// Track page views on route changes
		trackPageView(location.pathname + location.search);
	}, [location.pathname, location.search]);

	return (
		<html lang="en">
			<head>
				<HeadContent />
				{shouldLoadGA() && GA_MEASUREMENT_ID && (
					<>
						<script
							async
							src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
						/>
						{/* Note: dangerouslySetInnerHTML is required here for Google Analytics initialization per Google's official documentation */}
						<script
							dangerouslySetInnerHTML={{
								__html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
									gtag('config', '${GA_MEASUREMENT_ID}', {
										send_page_view: false
									});
								`,
							}}
						/>
					</>
				)}
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
