import { createFileRoute } from "@tanstack/react-router";
import { Github, Globe, Mail } from "lucide-react";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<main className="px-4 sm:px-6 pb-32 max-w-2xl mx-auto space-y-8 sm:space-y-12">
			<section className="space-y-4 sm:space-y-6">
				<h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-green-500">
					The Mission
				</h2>
				<p className="text-gray-300 text-sm sm:text-base leading-relaxed">
					<span className="text-white font-bold italic">Späti Culture</span>{" "}
					curates Berlin's best Spätis with seating, toilets, and card payment.
					We help you find places where you can actually sit down, have a
					conversation, and enjoy the neighborhood atmosphere, not just grab a
					bottle and go.
				</p>
			</section>

			<section className="space-y-4 sm:space-y-6">
				<div className="bg-gray-900/40 border border-gray-800 p-4 sm:p-6 rounded-xl">
					<h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mb-3 sm:mb-4">
						Community Driven
					</h3>
					<p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
						Every spot listed is vetted by locals. We focus on quality of
						experience and authentic Berlin vibes.
					</p>
				</div>
				<div className="bg-gray-900/40 border border-gray-800 p-4 sm:p-6 rounded-xl">
					<h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mb-3 sm:mb-4">
						Privacy First
					</h3>
					<p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
						We use your geolocation only to find spots near you. We don't store
						your movement history or sell your data.
					</p>
				</div>
				<div className="bg-gray-900/40 border border-gray-800 p-4 sm:p-6 rounded-xl">
					<h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mb-3 sm:mb-4">
						Supporting the Culture
					</h3>
					<p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
						Berlin's Späti Culture is recognized by UNESCO, protecting these
						essential neighborhood hubs and celebrating their unique social role
						in the city's cultural fabric.
					</p>
				</div>
			</section>

			<section className="space-y-4 sm:space-y-6 border-t border-gray-900 pt-6 sm:pt-8">
				<h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-green-500">
					Get in Touch
				</h2>
				<nav
					className="flex flex-col gap-3 sm:gap-4"
					aria-label="Contact links"
				>
					<a
						href="mailto:sacadalabs@gmail.com"
						className="flex items-center gap-3 min-h-[44px] px-2 py-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg transition-colors touch-manipulation group"
						aria-label="Send email to sacadalabs@gmail.com"
					>
						<Mail
							size={18}
							className="text-gray-600 group-hover:text-green-500 group-focus:text-green-500 transition-colors flex-shrink-0"
							aria-hidden="true"
						/>
						<span className="text-sm sm:text-base break-all">
							sacadalabs@gmail.com
						</span>
					</a>

					<a
						href="https://github.com/sacada-labs/spaeti-culture"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 min-h-[44px] px-2 py-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg transition-colors touch-manipulation group"
						aria-label="Visit GitHub repository (opens in new tab)"
					>
						<Github
							size={18}
							className="text-gray-600 group-hover:text-green-500 group-focus:text-green-500 transition-colors flex-shrink-0"
							aria-hidden="true"
						/>
						<span className="text-sm sm:text-base">GitHub</span>
					</a>

					<a
						href="https://sacadalabs.com"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 min-h-[44px] px-2 py-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg transition-colors touch-manipulation group"
						aria-label="Visit Sacada Labs website (opens in new tab)"
					>
						<Globe
							size={18}
							className="text-gray-600 group-hover:text-green-500 group-focus:text-green-500 transition-colors flex-shrink-0"
							aria-hidden="true"
						/>
						<span className="text-sm sm:text-base">Sacada Labs</span>
					</a>
				</nav>
			</section>
		</main>
	);
}
