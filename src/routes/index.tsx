import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { useEffect, useId, useState } from "react";
import { z } from "zod";
import { Loading } from "../components/Loading";
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
	latitude: z.number().optional(),
	longitude: z.number().optional(),
});

const fetchSpatis = createServerFn()
	.inputValidator(fetchSpatisSchema)
	.handler(async ({ data }) => {
		const { hasToilet, priceLevel, acceptsCard, latitude, longitude } = data;

		if (latitude !== undefined && longitude !== undefined) {
			console.log("User location:", { latitude, longitude });
		}

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

		if (conditions.length > 0) {
			const records = await db
				.select()
				.from(spatis)
				.where(and(...conditions));
			return records;
		}

		const records = await db.select().from(spatis);
		return records;
	});

function App() {
	const [hasToiletFilter, setHasToiletFilter] = useState(false);
	const [priceLevelFilter, setPriceLevelFilter] = useState<
		"$" | "$$" | "$$$" | undefined
	>(undefined);
	const [acceptsCardFilter, setAcceptsCardFilter] = useState(false);
	const {
		location: userLocation,
		error: locationError,
		isLoading: locationLoading,
	} = useGeolocation();
	const fetchSpatisFn = useServerFn(fetchSpatis);
	const toiletFilterId = useId();
	const priceLevelFilterId = useId();
	const acceptsCardFilterId = useId();

	const spatiesQuery = useQuery({
		queryKey: ["spaties", hasToiletFilter, priceLevelFilter, acceptsCardFilter, userLocation],
		queryFn: () =>
			fetchSpatisFn({
				data: {
					hasToilet: hasToiletFilter ? true : undefined,
					priceLevel: priceLevelFilter,
					acceptsCard: acceptsCardFilter ? true : undefined,
					latitude: userLocation?.latitude,
					longitude: userLocation?.longitude,
				},
			}),
		enabled: !!userLocation, // Only run query when location is available
	});

	// Block until location is available
	if (locationLoading) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center max-w-md px-6">
					<div className="w-16 h-16 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-300 text-base mb-2">Getting your location...</p>
					<p className="text-gray-500 text-sm">
						We need your location to better tune your experience and show you
						Spätis near you.
					</p>
				</div>
			</div>
		);
	}

	if (locationError || !userLocation) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center max-w-md px-6">
					<p className="text-red-400 mb-2 text-lg">Unable to get your location</p>
					<p className="text-gray-400 text-sm mb-4">
						{locationError || "Location is required"}
					</p>
					<p className="text-gray-500 text-sm">
						We need your location to better tune your experience and show you
						Spätis near you. Please enable location access in your browser
						settings.
					</p>
				</div>
			</div>
		);
	}

	if (spatiesQuery.isPending) {
		return <Loading />;
	}
	
	if (spatiesQuery.isError) {
		return <div>Error: {spatiesQuery.error.message}</div>;
	}

	const spaties = spatiesQuery.data;

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<header className="px-6 py-8">
				<div className="flex items-center gap-3 mb-2">
					<span className="text-2xl">🍺</span>
					<h1 className="text-3xl font-bold tracking-tight text-green-500 uppercase">
						SIT-IN SPAETI
					</h1>
				</div>
				<p className="text-gray-400 text-sm">
					FIND SPAETIS WITH SEATING IN BERLIN.
				</p>
				{/* Location Status */}
				<div className="mt-3 text-xs">
					<span className="text-green-500">
						📍 Location: {userLocation.latitude.toFixed(4)},{" "}
						{userLocation.longitude.toFixed(4)}
					</span>
				</div>
			</header>

			<main className="px-6 pb-20 max-w-7xl mx-auto">
				{/* Filters */}
				<div className="mb-6 flex flex-wrap items-center gap-6">
					<label
						htmlFor={toiletFilterId}
						className="flex items-center gap-2 cursor-pointer"
					>
						<input
							id={toiletFilterId}
							type="checkbox"
							checked={hasToiletFilter}
							onChange={(e) => setHasToiletFilter(e.target.checked)}
							className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-green-500 focus:ring-green-500 focus:ring-offset-0"
						/>
						<span className="text-sm text-gray-400">Has Toilet</span>
					</label>

					<label
						htmlFor={acceptsCardFilterId}
						className="flex items-center gap-2 cursor-pointer"
					>
						<input
							id={acceptsCardFilterId}
							type="checkbox"
							checked={acceptsCardFilter}
							onChange={(e) => setAcceptsCardFilter(e.target.checked)}
							className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-green-500 focus:ring-green-500 focus:ring-offset-0"
						/>
						<span className="text-sm text-gray-400">Accepts Card</span>
					</label>

					<div className="flex items-center gap-2">
						<label
							htmlFor={priceLevelFilterId}
							className="text-sm text-gray-400"
						>
							Price:
						</label>
						<select
							id={priceLevelFilterId}
							value={priceLevelFilter ?? ""}
							onChange={(e) =>
								setPriceLevelFilter(
									e.target.value === ""
										? undefined
										: (e.target.value as "$" | "$$" | "$$$"),
								)
							}
							className="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-green-500"
						>
							<option value="">All</option>
							<option value="$">$</option>
							<option value="$$">$$</option>
							<option value="$$$">$$$</option>
						</select>
					</div>
				</div>

				{/* Späti Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{spaties.map((spati) => (
						<div
							key={spati.id}
							className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
						>
							<h2 className="text-xl font-bold mb-2">{spati.name}</h2>
							<p className="text-gray-400 text-sm mb-3">{spati.address}</p>
							{spati.description && (
								<p className="text-gray-300 text-sm mb-4">
									{spati.description}
								</p>
							)}
							<div className="flex flex-wrap gap-2">
								<span className="px-3 py-1 text-xs font-medium rounded border bg-blue-500/20 text-blue-300 border-blue-500/30">
									{spati.seating}
								</span>
								{spati.hasToilet === "YES" && (
									<span className="px-3 py-1 text-xs font-medium rounded border bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
										TOILET
									</span>
								)}
								{spati.payment === "CARD" && (
									<span className="px-3 py-1 text-xs font-medium rounded border bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
										CARD
									</span>
								)}
								<span
									className={`px-3 py-1 text-xs font-medium rounded border ${
										spati.priceLevel.includes("EXPENSIVE")
											? "bg-purple-500/20 text-purple-300 border-purple-500/30"
											: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
									}`}
								>
									{spati.priceLevel}
								</span>
							</div>
						</div>
					))}
				</div>
			</main>

			{/* Footer */}
			<footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-900 px-6 py-4">
				<div className="max-w-7xl mx-auto">
					<p className="text-xs text-gray-500 flex items-center gap-2">
						© 2025 Sacada Labs. Handcrafted in Berlin <span>🥨</span>
					</p>
				</div>
			</footer>
		</div>
	);
}
