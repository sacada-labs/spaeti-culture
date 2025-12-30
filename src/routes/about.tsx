import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Beer, Github, Globe, Mail } from "lucide-react";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
			{/* Header */}
			<header className="px-6 pt-12 pb-8 max-w-3xl mx-auto">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors mb-8 group"
				>
					<ArrowLeft
						size={16}
						className="group-hover:-translate-x-1 transition-transform"
					/>
					<span className="text-xs font-bold uppercase tracking-widest">
						Back to Map
					</span>
				</Link>

				<div className="flex items-center gap-3 mb-4">
					<div className="w-12 h-12 bg-green-500 flex items-center justify-center rounded-xl rotate-3">
						<Beer className="text-black" size={28} />
					</div>
					<h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
						About <span className="text-green-500">Sit-in</span>
					</h1>
				</div>
			</header>

			<main className="px-6 pb-32 max-w-3xl mx-auto space-y-12">
				<section className="space-y-6">
					<h2 className="text-xl font-bold uppercase tracking-tight text-green-500">
						The Mission
					</h2>
					<p className="text-gray-300 text-lg leading-relaxed">
						Berlin's Spätis (late-night convenience stores) are the lifeblood of
						the city's social fabric. But sometimes, you want more than just a
						bottle on the go—you want a place to sit, talk, and soak in the
						neighborhood atmosphere.
					</p>
					<p className="text-gray-400 leading-relaxed">
						<span className="text-white font-bold italic">Sit-in Späti</span> is a
						curated community resource designed to help Berliners and visitors
						find those rare gems: Spätis with dedicated seating, available
						toilets, and card payment support.
					</p>
				</section>

				<section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
					<div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl">
						<h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">
							Community Driven
						</h3>
						<p className="text-gray-400 text-sm">
							Every spot listed is vetted by locals. We focus on quality of
							experience and authentic Berlin vibes.
						</p>
					</div>
					<div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl">
						<h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">
							Privacy First
						</h3>
						<p className="text-gray-400 text-sm">
							We use your geolocation only to find spots near you. We don't
							store your movement history or sell your data.
						</p>
					</div>
				</section>

				<section className="space-y-6 border-t border-gray-900 pt-12">
					<h2 className="text-xl font-bold uppercase tracking-tight text-green-500">
						Get in Touch
					</h2>
					<div className="flex flex-wrap gap-4">
						<button
							type="button"
							className="flex items-center gap-3 px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-green-500/50 hover:bg-gray-800 transition-all group"
						>
							<Mail size={18} className="text-gray-500 group-hover:text-green-500" />
							<span className="text-sm font-bold">Contact Us</span>
						</button>
						<button
							type="button"
							className="flex items-center gap-3 px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-green-500/50 hover:bg-gray-800 transition-all group"
						>
							<Github size={18} className="text-gray-500 group-hover:text-green-500" />
							<span className="text-sm font-bold">GitHub</span>
						</button>
						<button
							type="button"
							className="flex items-center gap-3 px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-green-500/50 hover:bg-gray-800 transition-all group"
						>
							<Globe size={18} className="text-gray-500 group-hover:text-green-500" />
							<span className="text-sm font-bold">Sacada Labs</span>
						</button>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-gray-900 px-6 py-6 z-20">
				<div className="max-w-3xl mx-auto flex justify-between items-center">
					<p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">
						© 2025 Sacada Labs <span className="text-gray-800">•</span> Berlin{" "}
						<span>🥨</span>
					</p>
					<div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">
						<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
						<span className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest">
							v1.0.4-stable
						</span>
					</div>
				</div>
			</footer>
		</div>
	);
}

