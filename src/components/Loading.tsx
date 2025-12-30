export function Loading() {
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
