import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

interface Spati {
	id: number;
	name: string;
	address: string;
	description: string;
	distance: number;
	amenities: string[];
	priceLevel: "$$$ EXPENSIVE" | "$$ AVERAGE" | "$ CHEAP";
}

const mockSpatis: Spati[] = [
	{
		id: 1,
		name: "SPÄTI CHARLOTTENBURG",
		address: "Kantstraße 125, 10625 Berlin",
		description: "Classic Späti in Charlottenburg with indoor seating area",
		distance: 3.9,
		amenities: ["INDOOR", "TOILET", "CARD"],
		priceLevel: "$$$ EXPENSIVE",
	},
	{
		id: 2,
		name: "SPÄTI MITTE",
		address: "Rosenthaler Straße 40, 10178 Berlin",
		description: "Modern Späti in Mitte with comfortable indoor seating",
		distance: 9.7,
		amenities: ["INDOOR", "TOILET", "CARD"],
		priceLevel: "$$$ EXPENSIVE",
	},
	{
		id: 3,
		name: "SPÄTI PRENZLAUER BERG",
		address: "Kastanienallee 85, 10435 Berlin",
		description: "Charming Späti in Prenzlauer Berg with outdoor terrace",
		distance: 10.6,
		amenities: ["OUTDOOR"],
		priceLevel: "$$ AVERAGE",
	},
	{
		id: 4,
		name: "SPÄTI WEDDING",
		address: "Müllerstraße 146, 13353 Berlin",
		description: "Friendly neighborhood Späti with indoor and outdoor options",
		distance: 7.2,
		amenities: ["INDOOR", "OUTDOOR", "TOILET"],
		priceLevel: "$$ AVERAGE",
	},
	{
		id: 5,
		name: "SPÄTI KREUZBERG",
		address: "Oranienstraße 190, 10999 Berlin",
		description: "Iconic Kreuzberg Späti with both indoor and outdoor spaces",
		distance: 10.3,
		amenities: ["INDOOR", "OUTDOOR", "TOILET", "CARD"],
		priceLevel: "$$ AVERAGE",
	},
	{
		id: 6,
		name: "SPÄTI AM KOTTI",
		address: "Kottbusser Damm 1, 10967 Berlin",
		description: "Popular Späti near Kottbusser Tor with both indoor and outdoor seating",
		distance: 11.1,
		amenities: ["INDOOR", "OUTDOOR"],
		priceLevel: "$$ AVERAGE",
	},
];

function App() {
	const [filtersOpen, setFiltersOpen] = useState(false);

	const getAmenityColor = (amenity: string) => {
		switch (amenity) {
			case "INDOOR":
				return "bg-blue-500/20 text-blue-300 border-blue-500/30";
			case "OUTDOOR":
				return "bg-green-500/20 text-green-300 border-green-500/30";
			case "TOILET":
				return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
			case "CARD":
				return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
			default:
				return "bg-gray-500/20 text-gray-300 border-gray-500/30";
		}
	};

	const getPriceColor = (priceLevel: string) => {
		if (priceLevel.includes("EXPENSIVE")) {
			return "bg-purple-500/20 text-purple-300 border-purple-500/30";
		}
		return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<header className="px-6 py-8">
				<div className="flex items-center gap-3 mb-2">
					<span className="text-2xl">🍺</span>
					<h1 className="text-3xl font-bold tracking-tight">SIT-IN SPAETI</h1>
				</div>
				<p className="text-gray-400 text-sm">FIND SPAETIS WITH SEATING IN BERLIN.</p>
			</header>

			{/* Filters Section */}
			<div className="px-6 mb-8">
				<button
					onClick={() => setFiltersOpen(!filtersOpen)}
					className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
				>
					<span className="text-sm font-medium">SHOW FILTERS</span>
					<ChevronDown
						className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
					/>
				</button>
				{filtersOpen && (
					<div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
						<p className="text-sm text-gray-400">Filters coming soon...</p>
					</div>
				)}
			</div>

			{/* Späti Grid */}
			<main className="px-6 pb-20">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
					{mockSpatis.map((spati) => (
						<div
							key={spati.id}
							className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
						>
							{/* Name */}
							<h2 className="text-xl font-bold mb-2">{spati.name}</h2>

							{/* Address */}
							<p className="text-gray-400 text-sm mb-3">{spati.address}</p>

							{/* Description */}
							<p className="text-gray-300 text-sm mb-4">{spati.description}</p>

							{/* Distance */}
							<div className="flex items-center gap-2 mb-4">
								<MapPin className="w-4 h-4 text-green-400" />
								<span className="text-sm text-gray-300">{spati.distance}km</span>
							</div>

							{/* Amenities */}
							<div className="flex flex-wrap gap-2">
								{spati.amenities.map((amenity) => (
									<span
										key={amenity}
										className={`px-3 py-1 text-xs font-medium rounded border ${getAmenityColor(amenity)}`}
									>
										{amenity}
									</span>
								))}
								<span
									className={`px-3 py-1 text-xs font-medium rounded border ${getPriceColor(spati.priceLevel)}`}
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
