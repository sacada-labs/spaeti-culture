import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

interface Spati {
	id: number;
	name: string;
	address: string;
	description: string;
	distance: number;
	seating: "INDOOR" | "OUTDOOR" | "BOTH";
	hasToilet: boolean;
	priceLevel: "$$$ EXPENSIVE" | "$$ AVERAGE" | "$ CHEAP";
	payment: "CARD" | "CASH ONLY";
	neighborhood: string;
	isOpen: boolean;
}

const mockSpatis: Spati[] = [
	{
		id: 1,
		name: "SPÄTI CHARLOTTENBURG",
		address: "Kantstraße 125, 10625 Berlin",
		description: "Classic Späti in Charlottenburg with indoor seating area",
		distance: 3.9,
		seating: "INDOOR",
		hasToilet: true,
		priceLevel: "$$$ EXPENSIVE",
		payment: "CARD",
		neighborhood: "CHARLOTTENBURG",
		isOpen: true,
	},
	{
		id: 2,
		name: "SPÄTI MITTE",
		address: "Rosenthaler Straße 40, 10178 Berlin",
		description: "Modern Späti in Mitte with comfortable indoor seating",
		distance: 9.7,
		seating: "INDOOR",
		hasToilet: true,
		priceLevel: "$$$ EXPENSIVE",
		payment: "CARD",
		neighborhood: "MITTE",
		isOpen: true,
	},
	{
		id: 3,
		name: "SPÄTI PRENZLAUER BERG",
		address: "Kastanienallee 85, 10435 Berlin",
		description: "Charming Späti in Prenzlauer Berg with outdoor terrace",
		distance: 10.6,
		seating: "OUTDOOR",
		hasToilet: false,
		priceLevel: "$$ AVERAGE",
		payment: "CASH ONLY",
		neighborhood: "PRENZLAUER BERG",
		isOpen: true,
	},
	{
		id: 4,
		name: "SPÄTI WEDDING",
		address: "Müllerstraße 146, 13353 Berlin",
		description: "Friendly neighborhood Späti with indoor and outdoor options",
		distance: 7.2,
		seating: "BOTH",
		hasToilet: true,
		priceLevel: "$$ AVERAGE",
		payment: "CASH ONLY",
		neighborhood: "WEDDING",
		isOpen: true,
	},
	{
		id: 5,
		name: "SPÄTI KREUZBERG",
		address: "Oranienstraße 190, 10999 Berlin",
		description: "Iconic Kreuzberg Späti with both indoor and outdoor spaces",
		distance: 10.3,
		seating: "BOTH",
		hasToilet: true,
		priceLevel: "$$ AVERAGE",
		payment: "CARD",
		neighborhood: "KREUZBERG",
		isOpen: true,
	},
	{
		id: 6,
		name: "SPÄTI AM KOTTI",
		address: "Kottbusser Damm 1, 10967 Berlin",
		description:
			"Popular Späti near Kottbusser Tor with both indoor and outdoor seating",
		distance: 11.1,
		seating: "BOTH",
		hasToilet: false,
		priceLevel: "$$ AVERAGE",
		payment: "CARD",
		neighborhood: "KREUZBERG",
		isOpen: true,
	},
	{
		id: 7,
		name: "SPÄTI FRIEDRICHSHAIN",
		address: "Warschauer Straße 34, 10243 Berlin",
		description: "Vibrant Späti in Friedrichshain with outdoor seating",
		distance: 8.5,
		seating: "OUTDOOR",
		hasToilet: true,
		priceLevel: "$ CHEAP",
		payment: "CARD",
		neighborhood: "FRIEDRICHSHAIN",
		isOpen: true,
	},
	{
		id: 8,
		name: "SPÄTI NEUKÖLLN",
		address: "Sonnenallee 45, 12045 Berlin",
		description: "Local favorite in Neukölln with indoor seating",
		distance: 12.3,
		seating: "INDOOR",
		hasToilet: true,
		priceLevel: "$ CHEAP",
		payment: "CASH ONLY",
		neighborhood: "NEUKÖLLN",
		isOpen: true,
	},
	{
		id: 9,
		name: "SPÄTI TEMPELHOF",
		address: "Tempelhofer Damm 1, 12101 Berlin",
		description: "Späti near Tempelhof with outdoor seating",
		distance: 5.2,
		seating: "OUTDOOR",
		hasToilet: false,
		priceLevel: "$ CHEAP",
		payment: "CARD",
		neighborhood: "TEMPELHOF",
		isOpen: true,
	},
	{
		id: 10,
		name: "SPÄTI FRIEDRICHSHAIN 2",
		address: "Boxhagener Straße 12, 10245 Berlin",
		description: "Another great Späti in Friedrichshain",
		distance: 9.1,
		seating: "BOTH",
		hasToilet: true,
		priceLevel: "$ CHEAP",
		payment: "CARD",
		neighborhood: "FRIEDRICHSHAIN",
		isOpen: true,
	},
];

type FilterState = {
	seating: string | null;
	toilet: string | null;
	price: string | null;
	payment: string | null;
	neighborhood: string | null;
	status: string | null;
};

function App() {
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState<FilterState>({
		seating: "ALL",
		toilet: "ALL",
		price: "ALL PRICES",
		payment: "ALL",
		neighborhood: "ALL AREAS",
		status: "ALL",
	});

	// Calculate counts for each filter option based on other active filters
	const filterCounts = useMemo(() => {
		// Get base filtered set (excluding the category we're counting)
		const getBaseFiltered = (excludeCategory: keyof FilterState) => {
			return mockSpatis.filter((spati) => {
				if (
					excludeCategory !== "seating" &&
					filters.seating !== "ALL" &&
					filters.seating !== null
				) {
					if (spati.seating !== filters.seating) return false;
				}
				if (
					excludeCategory !== "toilet" &&
					filters.toilet !== "ALL" &&
					filters.toilet !== null
				) {
					if (filters.toilet === "TOILET" && !spati.hasToilet) return false;
					if (filters.toilet === "NO TOILET" && spati.hasToilet) return false;
				}
				if (
					excludeCategory !== "price" &&
					filters.price !== "ALL PRICES" &&
					filters.price !== null
				) {
					if (spati.priceLevel !== filters.price) return false;
				}
				if (
					excludeCategory !== "payment" &&
					filters.payment !== "ALL" &&
					filters.payment !== null
				) {
					if (spati.payment !== filters.payment) return false;
				}
				if (
					excludeCategory !== "neighborhood" &&
					filters.neighborhood !== "ALL AREAS" &&
					filters.neighborhood !== null
				) {
					if (spati.neighborhood !== filters.neighborhood) return false;
				}
				if (
					excludeCategory !== "status" &&
					filters.status !== "ALL" &&
					filters.status !== null
				) {
					if (filters.status === "OPEN NOW" && !spati.isOpen) return false;
					if (filters.status === "CLOSED" && spati.isOpen) return false;
				}
				return true;
			});
		};

		const baseForSeating = getBaseFiltered("seating");
		const baseForToilet = getBaseFiltered("toilet");
		const baseForPrice = getBaseFiltered("price");
		const baseForPayment = getBaseFiltered("payment");
		const baseForNeighborhood = getBaseFiltered("neighborhood");
		const baseForStatus = getBaseFiltered("status");

		return {
			seating: {
				ALL: baseForSeating.length,
				INDOOR: baseForSeating.filter((s) => s.seating === "INDOOR").length,
				OUTDOOR: baseForSeating.filter((s) => s.seating === "OUTDOOR").length,
				BOTH: baseForSeating.filter((s) => s.seating === "BOTH").length,
			},
			toilet: {
				ALL: baseForToilet.length,
				TOILET: baseForToilet.filter((s) => s.hasToilet).length,
				"NO TOILET": baseForToilet.filter((s) => !s.hasToilet).length,
			},
			price: {
				"ALL PRICES": baseForPrice.length,
				"$ CHEAP": baseForPrice.filter((s) => s.priceLevel === "$ CHEAP")
					.length,
				"$$ AVERAGE": baseForPrice.filter((s) => s.priceLevel === "$$ AVERAGE")
					.length,
				"$$$ EXPENSIVE": baseForPrice.filter(
					(s) => s.priceLevel === "$$$ EXPENSIVE",
				).length,
			},
			payment: {
				ALL: baseForPayment.length,
				CARD: baseForPayment.filter((s) => s.payment === "CARD").length,
				"CASH ONLY": baseForPayment.filter((s) => s.payment === "CASH ONLY")
					.length,
			},
			neighborhood: {
				"ALL AREAS": baseForNeighborhood.length,
				KREUZBERG: baseForNeighborhood.filter(
					(s) => s.neighborhood === "KREUZBERG",
				).length,
				FRIEDRICHSHAIN: baseForNeighborhood.filter(
					(s) => s.neighborhood === "FRIEDRICHSHAIN",
				).length,
				"PRENZLAUER BERG": baseForNeighborhood.filter(
					(s) => s.neighborhood === "PRENZLAUER BERG",
				).length,
				MITTE: baseForNeighborhood.filter((s) => s.neighborhood === "MITTE")
					.length,
				NEUKÖLLN: baseForNeighborhood.filter(
					(s) => s.neighborhood === "NEUKÖLLN",
				).length,
				CHARLOTTENBURG: baseForNeighborhood.filter(
					(s) => s.neighborhood === "CHARLOTTENBURG",
				).length,
				TEMPELHOF: baseForNeighborhood.filter(
					(s) => s.neighborhood === "TEMPELHOF",
				).length,
			},
			status: {
				ALL: baseForStatus.length,
				"OPEN NOW": baseForStatus.filter((s) => s.isOpen).length,
				CLOSED: baseForStatus.filter((s) => !s.isOpen).length,
			},
		};
	}, [filters]);

	// Filter Spätis based on selected filters
	const filteredSpatis = useMemo(() => {
		return mockSpatis.filter((spati) => {
			if (filters.seating !== "ALL" && filters.seating !== null) {
				if (spati.seating !== filters.seating) return false;
			}
			if (filters.toilet !== "ALL" && filters.toilet !== null) {
				if (filters.toilet === "TOILET" && !spati.hasToilet) return false;
				if (filters.toilet === "NO TOILET" && spati.hasToilet) return false;
			}
			if (filters.price !== "ALL PRICES" && filters.price !== null) {
				if (spati.priceLevel !== filters.price) return false;
			}
			if (filters.payment !== "ALL" && filters.payment !== null) {
				if (spati.payment !== filters.payment) return false;
			}
			if (
				filters.neighborhood !== "ALL AREAS" &&
				filters.neighborhood !== null
			) {
				if (spati.neighborhood !== filters.neighborhood) return false;
			}
			if (filters.status !== "ALL" && filters.status !== null) {
				if (filters.status === "OPEN NOW" && !spati.isOpen) return false;
				if (filters.status === "CLOSED" && spati.isOpen) return false;
			}
			return true;
		});
	}, [filters]);

	const updateFilter = (category: keyof FilterState, value: string) => {
		setFilters((prev) => ({
			...prev,
			[category]:
				prev[category] === value
					? category === "price"
						? "ALL PRICES"
						: category === "neighborhood"
							? "ALL AREAS"
							: "ALL"
					: value,
		}));
	};

	const FilterButton = ({
		label,
		count,
		isSelected,
		onClick,
	}: {
		label: string;
		count: number;
		isSelected: boolean;
		onClick: () => void;
	}) => (
		<button
			onClick={onClick}
			className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
				isSelected
					? "bg-green-500 text-white"
					: "bg-gray-800 text-white hover:bg-gray-700"
			}`}
		>
			<span>{label}</span>
			<span
				className={`px-2 py-0.5 rounded-full text-xs ${
					isSelected ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
				}`}
			>
				{count}
			</span>
		</button>
	);

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

			{/* Filters Section */}
			<main className="px-6 pb-20 max-w-7xl mx-auto">
				{/* Toggle Filters Button */}
				<button
					onClick={() => setShowFilters(!showFilters)}
					className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
				>
					<span className="text-sm font-medium uppercase">
						{showFilters ? "HIDE" : "SHOW"} FILTERS
					</span>
					<ChevronDown
						className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
					/>
				</button>

				{showFilters && (
					<div className="space-y-8 mb-12">
						{/* SEATING Filter */}
						<div>
							<h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
								SEATING
							</h2>
							<div className="flex flex-wrap gap-2">
								<FilterButton
									label="ALL"
									count={filterCounts.seating.ALL}
									isSelected={filters.seating === "ALL"}
									onClick={() => updateFilter("seating", "ALL")}
								/>
								<FilterButton
									label="INDOOR"
									count={filterCounts.seating.INDOOR}
									isSelected={filters.seating === "INDOOR"}
									onClick={() => updateFilter("seating", "INDOOR")}
								/>
								<FilterButton
									label="OUTDOOR"
									count={filterCounts.seating.OUTDOOR}
									isSelected={filters.seating === "OUTDOOR"}
									onClick={() => updateFilter("seating", "OUTDOOR")}
								/>
								<FilterButton
									label="BOTH"
									count={filterCounts.seating.BOTH}
									isSelected={filters.seating === "BOTH"}
									onClick={() => updateFilter("seating", "BOTH")}
								/>
							</div>
						</div>

						{/* TOILET Filter */}
						<div>
							<h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
								TOILET
							</h2>
							<div className="flex flex-wrap gap-2">
								<FilterButton
									label="ALL"
									count={filterCounts.toilet.ALL}
									isSelected={filters.toilet === "ALL"}
									onClick={() => updateFilter("toilet", "ALL")}
								/>
								<FilterButton
									label="🚽 TOILET"
									count={filterCounts.toilet.TOILET}
									isSelected={filters.toilet === "TOILET"}
									onClick={() => updateFilter("toilet", "TOILET")}
								/>
								<FilterButton
									label="NO TOILET"
									count={filterCounts.toilet["NO TOILET"]}
									isSelected={filters.toilet === "NO TOILET"}
									onClick={() => updateFilter("toilet", "NO TOILET")}
								/>
							</div>
						</div>

						{/* PRICE Filter */}
						<div>
							<h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
								PRICE
							</h2>
							<div className="flex flex-wrap gap-2">
								<FilterButton
									label="ALL PRICES"
									count={filterCounts.price["ALL PRICES"]}
									isSelected={filters.price === "ALL PRICES"}
									onClick={() => updateFilter("price", "ALL PRICES")}
								/>
								<FilterButton
									label="$ CHEAP"
									count={filterCounts.price["$ CHEAP"]}
									isSelected={filters.price === "$ CHEAP"}
									onClick={() => updateFilter("price", "$ CHEAP")}
								/>
								<FilterButton
									label="$$ AVERAGE"
									count={filterCounts.price["$$ AVERAGE"]}
									isSelected={filters.price === "$$ AVERAGE"}
									onClick={() => updateFilter("price", "$$ AVERAGE")}
								/>
								<FilterButton
									label="$$$ EXPENSIVE"
									count={filterCounts.price["$$$ EXPENSIVE"]}
									isSelected={filters.price === "$$$ EXPENSIVE"}
									onClick={() => updateFilter("price", "$$$ EXPENSIVE")}
								/>
							</div>
						</div>

						{/* PAYMENT Filter */}
						<div>
							<h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
								PAYMENT
							</h2>
							<div className="flex flex-wrap gap-2">
								<FilterButton
									label="ALL"
									count={filterCounts.payment.ALL}
									isSelected={filters.payment === "ALL"}
									onClick={() => updateFilter("payment", "ALL")}
								/>
								<FilterButton
									label="💳 CARD"
									count={filterCounts.payment.CARD}
									isSelected={filters.payment === "CARD"}
									onClick={() => updateFilter("payment", "CARD")}
								/>
								<FilterButton
									label="CASH ONLY"
									count={filterCounts.payment["CASH ONLY"]}
									isSelected={filters.payment === "CASH ONLY"}
									onClick={() => updateFilter("payment", "CASH ONLY")}
								/>
							</div>
						</div>

						{/* NEIGHBORHOOD Filter */}
						<div>
							<h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
								NEIGHBORHOOD
							</h2>
							<div className="flex flex-wrap gap-2">
								<FilterButton
									label="ALL AREAS"
									count={filterCounts.neighborhood["ALL AREAS"]}
									isSelected={filters.neighborhood === "ALL AREAS"}
									onClick={() => updateFilter("neighborhood", "ALL AREAS")}
								/>
								<FilterButton
									label="KREUZBERG"
									count={filterCounts.neighborhood.KREUZBERG}
									isSelected={filters.neighborhood === "KREUZBERG"}
									onClick={() => updateFilter("neighborhood", "KREUZBERG")}
								/>
								<FilterButton
									label="FRIEDRICHSHAIN"
									count={filterCounts.neighborhood.FRIEDRICHSHAIN}
									isSelected={filters.neighborhood === "FRIEDRICHSHAIN"}
									onClick={() => updateFilter("neighborhood", "FRIEDRICHSHAIN")}
								/>
								<FilterButton
									label="PRENZLAUER BERG"
									count={filterCounts.neighborhood["PRENZLAUER BERG"]}
									isSelected={filters.neighborhood === "PRENZLAUER BERG"}
									onClick={() =>
										updateFilter("neighborhood", "PRENZLAUER BERG")
									}
								/>
								<FilterButton
									label="MITTE"
									count={filterCounts.neighborhood.MITTE}
									isSelected={filters.neighborhood === "MITTE"}
									onClick={() => updateFilter("neighborhood", "MITTE")}
								/>
								<FilterButton
									label="NEUKÖLLN"
									count={filterCounts.neighborhood.NEUKÖLLN}
									isSelected={filters.neighborhood === "NEUKÖLLN"}
									onClick={() => updateFilter("neighborhood", "NEUKÖLLN")}
								/>
								<FilterButton
									label="CHARLOTTENBURG"
									count={filterCounts.neighborhood.CHARLOTTENBURG}
									isSelected={filters.neighborhood === "CHARLOTTENBURG"}
									onClick={() => updateFilter("neighborhood", "CHARLOTTENBURG")}
								/>
								<FilterButton
									label="TEMPELHOF"
									count={filterCounts.neighborhood.TEMPELHOF}
									isSelected={filters.neighborhood === "TEMPELHOF"}
									onClick={() => updateFilter("neighborhood", "TEMPELHOF")}
								/>
							</div>
						</div>

						{/* STATUS Filter */}
						<div>
							<h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
								STATUS
							</h2>
							<div className="flex flex-wrap gap-2">
								<FilterButton
									label="ALL"
									count={filterCounts.status.ALL}
									isSelected={filters.status === "ALL"}
									onClick={() => updateFilter("status", "ALL")}
								/>
								<FilterButton
									label="🟢 OPEN NOW"
									count={filterCounts.status["OPEN NOW"]}
									isSelected={filters.status === "OPEN NOW"}
									onClick={() => updateFilter("status", "OPEN NOW")}
								/>
								<FilterButton
									label="🔴 CLOSED"
									count={filterCounts.status.CLOSED}
									isSelected={filters.status === "CLOSED"}
									onClick={() => updateFilter("status", "CLOSED")}
								/>
							</div>
						</div>
					</div>
				)}

				{/* Späti Grid */}
				<div
					className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${showFilters ? "mt-12" : ""}`}
				>
					{filteredSpatis.map((spati) => (
						<div
							key={spati.id}
							className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
						>
							<h2 className="text-xl font-bold mb-2">{spati.name}</h2>
							<p className="text-gray-400 text-sm mb-3">{spati.address}</p>
							<p className="text-gray-300 text-sm mb-4">{spati.description}</p>
							<div className="flex items-center gap-2 mb-4">
								<MapPin className="w-4 h-4 text-green-400" />
								<span className="text-sm text-gray-300">
									{spati.distance}km
								</span>
							</div>
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
