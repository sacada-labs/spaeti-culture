import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import {
	Armchair,
	CreditCard,
	MapPin,
	Navigation,
	Search,
	Toilet,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { z } from "zod";
import { db } from "../db";
import { spatis } from "../db/schema";
import { loggerMiddleware } from "../lib/logger";

export const Route = createFileRoute("/")({ component: App });

type UserLocation = {
	latitude: number;
	longitude: number;
} | null;

function useGeolocation() {
	const [location, setLocation] = useState<UserLocation>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [bypassed, setBypassed] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
					if (
						typeof window !== "undefined" &&
						import.meta.env.VITE_GA_MEASUREMENT_ID
					) {
						ReactGA.event({
							category: "User",
							action: "location_permission_granted",
						});
					}
					setIsLoading(false);
				},
				(err) => {
					setError(err.message);
					if (
						typeof window !== "undefined" &&
						import.meta.env.VITE_GA_MEASUREMENT_ID
					) {
						ReactGA.event({
							category: "User",
							action: "location_permission_denied",
						});
					}
					setIsLoading(false);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000, // 5 minutes cache
				},
			);
		} else if (typeof window !== "undefined") {
			const errorMsg = "Geolocation is not supported by your browser";
			setError(errorMsg);
			if (
				typeof window !== "undefined" &&
				import.meta.env.VITE_GA_MEASUREMENT_ID
			) {
				ReactGA.event({
					category: "User",
					action: "location_not_supported",
				});
			}
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, []);

	const bypassError = () => {
		setBypassed(true);
		setIsLoading(false);
		if (
			typeof window !== "undefined" &&
			import.meta.env.VITE_GA_MEASUREMENT_ID
		) {
			ReactGA.event({
				category: "User",
				action: "location_error_bypassed",
			});
		}
	};

	return { location, error: bypassed ? null : error, isLoading, bypassError };
}

function formatDistance(meters: number | undefined): string | null {
	if (meters === undefined || meters === null) {
		return null;
	}
	if (meters < 1000) {
		return `${Math.round(meters)} m`;
	}
	return `${(meters / 1000).toFixed(1)} km`;
}

const priceLevels = ["$", "$$", "$$$"] as const;

const fetchSpatisSchema = z.object({
	hasToilet: z.boolean().optional(),
	priceLevel: z.enum(priceLevels).optional(),
	acceptsCard: z.boolean().optional(),
	hasSitting: z.boolean().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
});

const fetchSpatis = createServerFn()
	.middleware([loggerMiddleware])
	.inputValidator(fetchSpatisSchema)
	.handler(async ({ data }) => {
		const {
			hasToilet,
			priceLevel,
			acceptsCard,
			hasSitting,
			latitude,
			longitude,
		} = data;

		const getGoogleMapsUrl = (
			googleMapsUrl: string | null,
			address: string | null,
			zipCode: string | null,
		): string => {
			if (googleMapsUrl) {
				return googleMapsUrl.trim();
			}
			if (address && zipCode) {
				const fullAddress = `${address.trim()}, ${zipCode.trim()}`;
				return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
			}
			return "#";
		};

		const conditions = [isNotNull(spatis.reviewedAt)];

		if (hasToilet !== undefined) {
			conditions.push(eq(spatis.hasToilet, hasToilet ? "YES" : "NO"));
		}

		if (priceLevel !== undefined) {
			conditions.push(eq(spatis.priceLevel, priceLevel));
		}

		if (acceptsCard !== undefined) {
			conditions.push(eq(spatis.payment, acceptsCard ? "CARD" : "CASH_ONLY"));
		}

		if (hasSitting !== undefined) {
			conditions.push(eq(spatis.seating, "YES"));
		}

		// Build base query
		const baseQuery = db
			.select()
			.from(spatis)
			.where(and(...conditions));

		// Calculate and include distance if user location is provided
		if (latitude !== undefined && longitude !== undefined) {
			const records = await db
				.select({
					id: spatis.id,
					name: spatis.name,
					address: spatis.address,
					neighborhood: spatis.neighborhood,
					zipCode: spatis.zipCode,
					location: spatis.location,
					googleMapsUrl: spatis.googleMapsUrl,
					seating: spatis.seating,
					hasToilet: spatis.hasToilet,
					priceLevel: spatis.priceLevel,
					payment: spatis.payment,
					createdAt: spatis.createdAt,
					updatedAt: spatis.updatedAt,
					distance: sql<number>`ST_DistanceSphere(
						${spatis.location},
						ST_MakePoint(${longitude}, ${latitude})
					)`.as("distance"),
				})
				.from(spatis)
				.where(and(...conditions))
				.orderBy(
					sql`ST_DistanceSphere(
						${spatis.location},
						ST_MakePoint(${longitude}, ${latitude})
					)`,
				);
			return records.map((spati) => ({
				...spati,
				googleMapsUrl: getGoogleMapsUrl(
					spati.googleMapsUrl,
					spati.address,
					spati.zipCode,
				),
			}));
		}

		const records = await baseQuery;
		return records.map((spati) => ({
			...spati,
			googleMapsUrl: getGoogleMapsUrl(
				spati.googleMapsUrl,
				spati.address,
				spati.zipCode,
			),
		}));
	});

function App() {
	const [hasToiletFilter, setHasToiletFilter] = useState(false);
	const [priceLevelFilter, setPriceLevelFilter] = useState<
		"$" | "$$" | "$$$" | undefined
	>(undefined);
	const [acceptsCardFilter, setAcceptsCardFilter] = useState(false);
	const [hasSittingFilter, setHasSittingFilter] = useState(false);
	const {
		location: userLocation,
		error: locationError,
		isLoading: locationLoading,
		bypassError,
	} = useGeolocation();
	const fetchSpatisFn = useServerFn(fetchSpatis);

	const spatiesQuery = useQuery({
		queryKey: [
			"spaties",
			hasToiletFilter,
			priceLevelFilter,
			acceptsCardFilter,
			hasSittingFilter,
			userLocation,
		],
		queryFn: () => {
			return fetchSpatisFn({
				data: {
					hasToilet: hasToiletFilter ? true : undefined,
					priceLevel: priceLevelFilter,
					acceptsCard: acceptsCardFilter ? true : undefined,
					hasSitting: hasSittingFilter ? true : undefined,
					latitude: userLocation?.latitude,
					longitude: userLocation?.longitude,
				},
			});
		},
	});

	if (locationLoading) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="w-16 h-16 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
					<h2 className="text-lg sm:text-xl font-bold mb-2 uppercase tracking-tight">
						Locating...
					</h2>
					<p className="text-gray-400 text-sm sm:text-base px-4">
						We need your location to show you the best Spätis nearby.
					</p>
				</div>
			</div>
		);
	}

	if (locationError) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
				<div className="text-center max-w-md w-full border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 rounded-2xl">
					<div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<Navigation size={32} />
					</div>
					<h2 className="text-lg sm:text-xl font-bold mb-2 uppercase tracking-tight text-amber-400">
						Location Unavailable
					</h2>
					<p className="text-gray-400 text-sm sm:text-base mb-6">
						{locationError}. You can still browse all Spätis, but they won't be
						sorted by distance.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<button
							type="button"
							onClick={() => {
								if (
									typeof window !== "undefined" &&
									import.meta.env.VITE_GA_MEASUREMENT_ID
								) {
									ReactGA.event({
										category: "User",
										action: "location_retry",
									});
								}
								window.location.reload();
							}}
							className="px-6 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition-colors min-h-[48px] touch-manipulation"
						>
							Try Again
						</button>
						<button
							type="button"
							onClick={bypassError}
							className="px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-colors min-h-[48px] touch-manipulation"
						>
							Browse Anyway
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<main className="px-4 sm:px-6 pb-32 max-w-7xl mx-auto">
			{/* Filters Section */}
			<div className="mb-6 sm:mb-10 sticky top-2 sm:top-4 z-10 -mx-4 sm:mx-0 px-4 sm:px-0">
				<div className="bg-black/80 backdrop-blur-xl border border-gray-800 p-2 sm:p-3 rounded-2xl flex flex-wrap items-center gap-2 sm:gap-3 shadow-2xl overflow-x-auto sm:overflow-x-visible">
					<button
						type="button"
						aria-pressed={hasSittingFilter}
						onClick={() => {
							const newValue = !hasSittingFilter;
							setHasSittingFilter(newValue);
							if (
								typeof window !== "undefined" &&
								import.meta.env.VITE_GA_MEASUREMENT_ID
							) {
								ReactGA.event({
									category: "Filter",
									action: "filter_sitting",
									label: newValue ? "on" : "off",
								});
							}
						}}
						className={`min-h-[44px] min-w-[44px] sm:min-w-[120px] justify-center px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 touch-manipulation ${
							hasSittingFilter
								? "bg-green-500 text-black"
								: "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
						}`}
					>
						<Armchair size={16} className="flex-shrink-0" />
						<span className="hidden sm:inline">Sitting</span>
					</button>

					<button
						type="button"
						aria-pressed={hasToiletFilter}
						onClick={() => {
							const newValue = !hasToiletFilter;
							setHasToiletFilter(newValue);
							if (
								typeof window !== "undefined" &&
								import.meta.env.VITE_GA_MEASUREMENT_ID
							) {
								ReactGA.event({
									category: "Filter",
									action: "filter_toilet",
									label: newValue ? "on" : "off",
								});
							}
						}}
						className={`min-h-[44px] min-w-[44px] sm:min-w-[120px] justify-center px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 touch-manipulation ${
							hasToiletFilter
								? "bg-green-500 text-black"
								: "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
						}`}
					>
						<Toilet size={16} className="flex-shrink-0" />
						<span className="hidden sm:inline">Toilet</span>
					</button>

					<button
						type="button"
						aria-pressed={acceptsCardFilter}
						onClick={() => {
							const newValue = !acceptsCardFilter;
							setAcceptsCardFilter(newValue);
							if (
								typeof window !== "undefined" &&
								import.meta.env.VITE_GA_MEASUREMENT_ID
							) {
								ReactGA.event({
									category: "Filter",
									action: "filter_card",
									label: newValue ? "on" : "off",
								});
							}
						}}
						className={`min-h-[44px] min-w-[44px] sm:min-w-[120px] justify-center px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 touch-manipulation ${
							acceptsCardFilter
								? "bg-green-500 text-black"
								: "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
						}`}
					>
						<CreditCard size={16} className="flex-shrink-0" />
						<span className="hidden sm:inline">Card</span>
					</button>

					<div className="h-6 w-px bg-gray-800 mx-1 hidden sm:block" />

					<fieldset
						aria-label="Price level filter"
						className="flex items-center gap-1.5 sm:gap-1 bg-gray-900 p-1 rounded-xl border-0 m-0 min-h-[44px]"
					>
						{(
							[
								{ value: "$", label: "Budget" },
								{ value: "$$", label: "Moderate" },
								{ value: "$$$", label: "Premium" },
							] as const
						).map(({ value, label }) => (
							<button
								type="button"
								key={value}
								aria-pressed={priceLevelFilter === value}
								aria-label={label}
								onClick={() => {
									const newValue =
										priceLevelFilter === value ? undefined : value;
									setPriceLevelFilter(newValue);
									if (
										typeof window !== "undefined" &&
										import.meta.env.VITE_GA_MEASUREMENT_ID
									) {
										ReactGA.event({
											category: "Filter",
											action: "filter_price",
											label: newValue || "none",
										});
									}
								}}
								className={`min-w-[44px] min-h-[36px] sm:min-h-[36px] px-2 sm:px-3 rounded-lg text-xs font-bold transition-all touch-manipulation ${
									priceLevelFilter === value
										? "bg-green-500 text-black"
										: "text-gray-400 hover:text-white"
								}`}
							>
								{value}
							</button>
						))}
					</fieldset>

					{(hasSittingFilter ||
						hasToiletFilter ||
						acceptsCardFilter ||
						priceLevelFilter) && (
						<button
							type="button"
							onClick={() => {
								setHasSittingFilter(false);
								setHasToiletFilter(false);
								setAcceptsCardFilter(false);
								setPriceLevelFilter(undefined);
								if (
									typeof window !== "undefined" &&
									import.meta.env.VITE_GA_MEASUREMENT_ID
								) {
									ReactGA.event({
										category: "Filter",
										action: "clear_filters",
									});
								}
							}}
							className="ml-auto min-w-[44px] min-h-[44px] px-3 py-2 text-gray-400 hover:text-red-400 transition-colors flex items-center justify-center touch-manipulation"
							aria-label="Clear all filters"
						>
							<Trash2 size={18} />
						</button>
					)}
				</div>
			</div>

			{/* Späti Grid */}
			{spatiesQuery.isPending ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={`skeleton-${i}`}
							className="h-64 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse"
						/>
					))}
				</div>
			) : spatiesQuery.isError ? (
				<div className="bg-red-500/10 border border-red-500/20 p-6 sm:p-8 rounded-2xl text-center">
					<p className="text-red-400 text-sm sm:text-base">
						Failed to load Spätis: {spatiesQuery.error.message}
					</p>
				</div>
			) : spatiesQuery.data?.length === 0 ? (
				<div className="bg-gray-900/50 border border-gray-800 p-8 sm:p-12 rounded-2xl text-center">
					<Search size={48} className="mx-auto text-gray-700 mb-4 sm:mb-6" />
					<h3 className="text-lg sm:text-xl font-bold mb-2">No Spätis found</h3>
					<p className="text-gray-400 text-sm sm:text-base max-w-xs mx-auto mb-6 sm:mb-8">
						Try adjusting your filters or search area to find more results.
					</p>
					{(hasSittingFilter ||
						hasToiletFilter ||
						acceptsCardFilter ||
						priceLevelFilter) && (
						<button
							type="button"
							onClick={() => {
								setHasSittingFilter(false);
								setHasToiletFilter(false);
								setAcceptsCardFilter(false);
								setPriceLevelFilter(undefined);
								if (
									typeof window !== "undefined" &&
									import.meta.env.VITE_GA_MEASUREMENT_ID
								) {
									ReactGA.event({
										category: "Filter",
										action: "clear_filters",
									});
								}
							}}
							className="px-6 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition-colors min-h-[48px] touch-manipulation"
						>
							Clear All Filters
						</button>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{spatiesQuery.data.map((spati) => (
						<div
							key={spati.id}
							className="group bg-gray-900/40 border border-gray-800 rounded-2xl p-4 sm:p-6 hover:border-green-500/50 transition-all hover:shadow-2xl hover:shadow-green-500/5 flex flex-col spati-card opacity-0 min-h-[200px] sm:min-h-[240px]"
						>
							<div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
								<a
									href={spati.googleMapsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-lg sm:text-xl font-bold group-hover:text-green-500 transition-colors leading-tight cursor-pointer hover:underline"
									aria-label={`Open ${spati.name} on Google Maps`}
								>
									{spati.name}
								</a>
								<div className="flex gap-0.5">
									{[1, 2, 3].map((level) => (
										<span
											key={`price-${spati.id}-${level}`}
											className={`text-xs ${
												level <= (spati.priceLevel?.length || 0)
													? "text-green-500"
													: "text-gray-700"
											}`}
										>
											$
										</span>
									))}
								</div>
							</div>

							<div className="flex items-start gap-2 mb-3 sm:mb-4">
								<MapPin
									size={14}
									className="text-gray-400 mt-0.5 sm:mt-1 flex-shrink-0"
								/>
								<div className="flex-1 min-w-0">
									<p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
										{spati.address}
									</p>
									{"distance" in spati &&
										typeof (spati as typeof spati & { distance?: number })
											.distance === "number" && (
											<p className="text-green-500 text-xs font-bold mt-1 flex items-center gap-1">
												<Navigation size={12} />
												{formatDistance(
													(spati as typeof spati & { distance: number })
														.distance,
												) || ""}
											</p>
										)}
								</div>
							</div>

							<div className="mt-auto pt-4 sm:pt-6 border-t border-gray-800/50 flex flex-wrap gap-2">
								{spati.seating === "YES" && (
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
										<Armchair size={10} />
										Seating
									</div>
								)}

								{spati.hasToilet === "YES" && (
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
										<Toilet size={10} />
										Toilet
									</div>
								)}

								{spati.payment === "CARD" && (
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
										<CreditCard size={10} />
										Card
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</main>
	);
}
