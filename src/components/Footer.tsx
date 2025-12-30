import { Link } from "@tanstack/react-router";

export function Footer() {
	return (
		<footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-900 px-6 py-4 z-20">
			<nav
				aria-label="Footer navigation"
				className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3"
			>
				<p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 flex items-center gap-2">
					© 2025 Sacada Labs <span className="text-gray-800">•</span> Berlin{" "}
					<span>🥨</span>
				</p>

				<div className="flex items-center gap-4 sm:gap-6">
					<Link
						to="/"
						className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-green-500 transition-colors min-h-[44px] flex items-center [&.active]:text-green-500"
						activeProps={{ className: "active" }}
						activeOptions={{ exact: true }}
					>
						Home
					</Link>
					<Link
						to="/about"
						className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-green-500 transition-colors min-h-[44px] flex items-center [&.active]:text-green-500"
						activeProps={{ className: "active" }}
					>
						About
					</Link>
					<Link
						to="/submit"
						className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-green-500 transition-colors min-h-[44px] flex items-center [&.active]:text-green-500"
						activeProps={{ className: "active" }}
					>
						Submit
					</Link>
					<div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">
						<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
						<span className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest hidden sm:inline">
							Live
						</span>
					</div>
				</div>
			</nav>
		</footer>
	);
}

