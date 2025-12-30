import { Link } from "@tanstack/react-router";
import { Beer, MapPin } from "lucide-react";

interface HeaderProps {
	userLocation?: {
		latitude: number;
		longitude: number;
	} | null;
}

export function Header({ userLocation }: HeaderProps) {
	return (
		<header className="px-6 pt-12 pb-8 max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<Link to="/" className="flex items-center gap-3 mb-4 group w-fit">
						<div className="w-12 h-12 bg-green-500 flex items-center justify-center rounded-xl rotate-3 group-hover:rotate-0 transition-transform">
							<Beer className="text-black" size={28} />
						</div>
						<h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
							Sit-in <span className="text-green-500">Spaeti</span>
						</h1>
					</Link>
					<p className="text-gray-400 font-medium tracking-wide uppercase text-xs md:text-sm">
						Curated guide to Berlin's best late-night spots with seating.
					</p>
				</div>

				{userLocation && (
					<div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-[10px] md:text-xs text-green-500 font-mono">
						<MapPin size={12} className="animate-pulse" />
						<span>
							{userLocation.latitude.toFixed(4)},{" "}
							{userLocation.longitude.toFixed(4)}
						</span>
					</div>
				)}
			</div>
		</header>
	);
}

