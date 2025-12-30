import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { spatis } from "../db/schema";

export const Route = createFileRoute("/")({ component: App });

const fetchSpatis = createServerFn({
	method: "GET",
}).handler(async () => {
	const records = await db.select().from(spatis);
	return records;
});

function Loading() {
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
			</header>

			<main className="px-6 pb-20 max-w-7xl mx-auto">
				<div className="flex flex-col items-center justify-center min-h-[60vh]">
					<div className="relative">
						<div className="w-16 h-16 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin"></div>
					</div>
					<p className="mt-6 text-gray-400 text-sm uppercase tracking-wide">
						Loading Spätis...
					</p>
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

function App() {
	const fetchSpatisFn = useServerFn(fetchSpatis);

	const spatiesQuery = useQuery({
		queryKey: ["spaties"],
		queryFn: () => fetchSpatisFn(),
	});

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
			</header>

			<main className="px-6 pb-20 max-w-7xl mx-auto">
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
								{spati.hasToilet && (
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
