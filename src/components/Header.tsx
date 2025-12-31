import { Link } from "@tanstack/react-router";
import { Beer, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
	userLocation?: {
		latitude: number;
		longitude: number;
	} | null;
}

export function Header({ userLocation }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="px-6 pt-10 pb-8 max-w-7xl mx-auto relative z-50">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="flex justify-between items-start w-full md:w-auto">
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
							Find Berlin's best late-night spots with seating, toilets & card
							payment.
						</p>
					</div>

					<button
						type="button"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMenuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>

				<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
					{userLocation && (
						<div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-[10px] md:text-xs text-green-500 font-mono">
							<MapPin size={12} className="animate-pulse" />
							<span>
								{userLocation.latitude.toFixed(4)},{" "}
								{userLocation.longitude.toFixed(4)}
							</span>
						</div>
					)}

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-6">
						<Link
							to="/"
							className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-green-500 transition-colors [&.active]:text-green-500"
							activeProps={{ className: "active" }}
							activeOptions={{ exact: true }}
						>
							Home
						</Link>
						<Link
							to="/about"
							className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-green-500 transition-colors [&.active]:text-green-500"
							activeProps={{ className: "active" }}
						>
							About
						</Link>
						<Link
							to="/submit"
							className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-green-500 transition-colors [&.active]:text-green-500"
							activeProps={{ className: "active" }}
						>
							Submit
						</Link>
					</nav>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			{isMenuOpen && (
				<div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] md:hidden flex flex-col items-center justify-center gap-8">
					<button
						type="button"
						onClick={() => setIsMenuOpen(false)}
						className="absolute top-10 right-6 p-2 text-gray-400 hover:text-white transition-colors"
					>
						<X size={32} />
					</button>
					<nav className="flex flex-col items-center gap-8">
						<Link
							to="/"
							onClick={() => setIsMenuOpen(false)}
							className="text-2xl uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-green-500 transition-colors [&.active]:text-green-500"
							activeProps={{ className: "active" }}
							activeOptions={{ exact: true }}
						>
							Home
						</Link>
						<Link
							to="/about"
							onClick={() => setIsMenuOpen(false)}
							className="text-2xl uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-green-500 transition-colors [&.active]:text-green-500"
							activeProps={{ className: "active" }}
						>
							About
						</Link>
						<Link
							to="/submit"
							onClick={() => setIsMenuOpen(false)}
							className="text-2xl uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-green-500 transition-colors [&.active]:text-green-500"
							activeProps={{ className: "active" }}
						>
							Submit
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}
