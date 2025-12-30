import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { and, eq, ne, sql } from "drizzle-orm";
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
import { z } from "zod";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { db } from "../db";
import { spatis } from "../db/schema";

export const Route = createFileRoute("/")({ component: App });

type UserLocation = {
	latitude: number;
	longitude: number;
} | null;

function useGeolocation() {
	const [location, setLocation] = useState<UserLocation>(() => {
		// Lazy initialization - request immediately
		if (typeof window !== "undefined" && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(err) => {
					setError(err.message);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000, // 5 minutes cache
				},
			);
		} else if (typeof window !== "undefined") {
			setError("Geolocation is not supported by your browser");
		}
		return null;
	});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Update loading state when location or error changes
	useEffect(() => {
		if (location !== null || error !== null) {
			setIsLoading(false);
		}
	}, [location, error]);

	return { location, error, isLoading };
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

		const conditions = [];

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
			conditions.push(ne(spatis.seating, "UNKNOWN"));
		}

		// Build base query
		const baseQuery =
			conditions.length > 0
				? db
						.select()
						.from(spatis)
						.where(and(...conditions))
				: db.select().from(spatis);

		// Sort by distance if user location is provided
		if (latitude !== undefined && longitude !== undefined) {
			const records = await baseQuery.orderBy(
				sql`ST_DistanceSphere(
					${spatis.location},
					ST_MakePoint(${longitude}, ${latitude})
				)`,
			);
			return records;
		}

		const records = await baseQuery;
		return records;
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
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center max-w-md px-6">
					<div className="w-16 h-16 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
					<h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
						Locating...
					</h2>
					<p className="text-gray-400 text-sm">
						We need your location to show you the best Spätis nearby.
					</p>
				</div>
			</div>
		);
	}

	if (locationError) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center max-w-md px-6 border border-red-500/20 bg-red-500/5 p-8 rounded-2xl">
					<div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<Navigation size={32} />
					</div>
					<h2 className="text-xl font-bold mb-2 uppercase tracking-tight text-red-400">
						Location Required
					</h2>
					<p className="text-gray-400 text-sm mb-6">
						{locationError}. Please enable location access in your browser to
						use Sit-in Späti.
					</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="px-6 py-2 bg-red-500 text-black font-bold rounded-full hover:bg-red-400 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
			<Header userLocation={userLocation} />

			<main className="px-6 pb-32 max-w-7xl mx-auto">
				{/* Filters Section */}
				<div className="mb-10 sticky top-4 z-10">
					<div className="bg-black/80 backdrop-blur-xl border border-gray-800 p-2 rounded-2xl flex flex-wrap items-center gap-2 shadow-2xl">
						<button
							type="button"
							onClick={() => setHasSittingFilter(!hasSittingFilter)}
							className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
								hasSittingFilter
									? "bg-green-500 text-black"
									: "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
							}`}
						>
							<Armchair size={14} />
							Has Sitting
						</button>

						<button
							type="button"
							onClick={() => setHasToiletFilter(!hasToiletFilter)}
							className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
								hasToiletFilter
									? "bg-green-500 text-black"
									: "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
							}`}
						>
							<Toilet size={14} />
							Toilet
						</button>

						<button
							type="button"
							onClick={() => setAcceptsCardFilter(!acceptsCardFilter)}
							className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
								acceptsCardFilter
									? "bg-green-500 text-black"
									: "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
							}`}
						>
							<CreditCard size={14} />
							Card
						</button>

						<div className="h-6 w-px bg-gray-800 mx-1 hidden sm:block" />

						<div className="flex items-center gap-1 bg-gray-900 p-1 rounded-xl">
							{(["$", "$$", "$$$"] as const).map((level) => (
								<button
									type="button"
									key={level}
									onClick={() =>
										setPriceLevelFilter(
											priceLevelFilter === level ? undefined : level,
										)
									}
									className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
										priceLevelFilter === level
											? "bg-white text-black"
											: "text-gray-500 hover:text-white"
									}`}
								>
									{level}
								</button>
							))}
						</div>

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
								}}
								className="ml-auto px-3 py-2 text-gray-500 hover:text-red-400 transition-colors"
								title="Clear all filters"
							>
								<Trash2 size={16} />
							</button>
						)}
					</div>
				</div>

				{/* Späti Grid */}
				{spatiesQuery.isPending ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={`skeleton-${i}`}
								className="h-64 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse"
							/>
						))}
					</div>
				) : spatiesQuery.isError ? (
					<div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center">
						<p className="text-red-400">
							Failed to load Spätis: {spatiesQuery.error.message}
						</p>
					</div>
				) : spatiesQuery.data?.length === 0 ? (
					<div className="bg-gray-900/50 border border-gray-800 p-12 rounded-2xl text-center">
						<Search size={48} className="mx-auto text-gray-700 mb-4" />
						<h3 className="text-xl font-bold mb-2">No Spätis found</h3>
						<p className="text-gray-500 max-w-xs mx-auto">
							Try adjusting your filters or search area to find more results.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{spatiesQuery.data.map((spati) => (
							<div
								key={spati.id}
								className="group bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-green-500/50 transition-all hover:shadow-2xl hover:shadow-green-500/5 flex flex-col"
							>
								<div className="flex justify-between items-start mb-4">
									<h2 className="text-xl font-bold group-hover:text-green-500 transition-colors">
										{spati.name}
									</h2>
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

								<div className="flex items-start gap-2 mb-4">
									<MapPin
										size={14}
										className="text-gray-500 mt-1 flex-shrink-0"
									/>
									<p className="text-gray-400 text-sm leading-snug">
										{spati.address}
									</p>
								</div>

								{spati.description && (
									<p className="text-gray-500 text-sm mb-6 line-clamp-2">
										{spati.description}
									</p>
								)}

								<div className="mt-auto pt-6 border-t border-gray-800/50 flex flex-wrap gap-2">
									<div
										className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
											spati.seating !== "UNKNOWN"
												? "bg-green-500/10 text-green-500 border border-green-500/20"
												: "bg-gray-800 text-gray-500"
										}`}
									>
										<Armchair size={10} />
										{spati.seating}
									</div>

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

			<Footer />
		</div>
	);
}
