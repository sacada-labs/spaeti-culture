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
		<header className="px-6 pt-10 pb-8 max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<Link to="/" className="flex items-center gap-3 mb-3 group w-fit">
						<div className="w-11 h-11 md:w-14 md:h-14 bg-green-500 flex items-center justify-center rounded-xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-green-500/20">
							<Beer className="text-black" size={28} />
						</div>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-tight text-white uppercase">
							Sit-in <span className="text-green-500">Späti</span>
						</h1>
					</Link>
					<p className="text-gray-500 font-medium tracking-wide uppercase text-[10px] sm:text-xs md:text-sm max-w-md">
						Find Berlin's best late-night spots with seating, toilets & card payment.
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

