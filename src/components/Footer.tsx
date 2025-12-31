export function Footer() {
	return (
		<footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-900 px-4 sm:px-6 py-3 sm:py-4 z-20">
			<nav
				aria-label="Footer navigation"
				className="max-w-7xl mx-auto flex justify-center items-center"
			>
				<p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-gray-500 flex items-center gap-2 flex-wrap justify-center">
					© 2025 Sacada Labs{" "}
					<span className="text-gray-700 hidden sm:inline">•</span>{" "}
					<span className="hidden sm:inline">Berlin</span>
					<span className="sm:hidden">Berlin</span> <span>🥨</span>
				</p>
			</nav>
		</footer>
	);
}
