export function Footer() {
	return (
		<footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-900 px-6 py-4 z-20">
			<nav
				aria-label="Footer navigation"
				className="max-w-7xl mx-auto flex justify-between items-center"
			>
				<p className="text-xs text-gray-500 font-medium">
					© 2025 Sacada Labs. All rights reserved.
				</p>
				<p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
					Handcrafted in Berlin <span>🥨</span>
				</p>
			</nav>
		</footer>
	);
}
