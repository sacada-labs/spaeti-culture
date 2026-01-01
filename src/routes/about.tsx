import { createFileRoute } from "@tanstack/react-router";
import { Github, Globe, Mail } from "lucide-react";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<main className="px-4 sm:px-6 pb-32 max-w-3xl mx-auto space-y-8 sm:space-y-12">
			<section className="space-y-4 sm:space-y-6">
				<h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-green-500">
					The Mission
				</h2>
				<p className="text-gray-300 text-base sm:text-lg leading-relaxed">
					<span className="text-white font-bold italic">Späti Culture</span>{" "}
					curates Berlin's best Spätis with seating, toilets, and card payment. We help you find places where you can actually sit down, have a conversation, and enjoy the neighborhood atmosphere, not just grab a bottle and go.
				</p>
				<p className="text-gray-400 text-sm sm:text-base leading-relaxed">
					Berlin's Späti Culture has been recognized by UNESCO, ensuring these essential neighborhood hubs remain protected from automated vending machine takeovers. This recognition celebrates the unique social role these spaces play in the city's cultural fabric.
				</p>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6">
				<div className="bg-gray-900/40 border border-gray-800 p-4 sm:p-6 rounded-2xl">
					<h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mb-3 sm:mb-4">
						Community Driven
					</h3>
					<p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
						Every spot listed is vetted by locals. We focus on quality of
						experience and authentic Berlin vibes.
					</p>
				</div>
				<div className="bg-gray-900/40 border border-gray-800 p-4 sm:p-6 rounded-2xl">
					<h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mb-3 sm:mb-4">
						Privacy First
					</h3>
					<p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
						We use your geolocation only to find spots near you. We don't store
						your movement history or sell your data.
					</p>
				</div>
			</section>

			<section className="space-y-4 sm:space-y-6 border-t border-gray-900 pt-8 sm:pt-12">
				<h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">
					Get in Touch
				</h2>
				<div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-x-8 sm:gap-y-4">
					<a
						href="mailto:sacadalabs@gmail.com"
						className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group min-h-[44px] touch-manipulation"
					>
						<Mail
							size={16}
							className="text-gray-600 group-hover:text-green-500 transition-colors flex-shrink-0"
						/>
						<span className="text-sm font-medium break-all">
							sacadalabs@gmail.com
						</span>
					</a>

					<a
						href="https://github.com/sacadalabs/sit-in-spaeti"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group min-h-[44px] touch-manipulation"
					>
						<Github
							size={16}
							className="text-gray-600 group-hover:text-green-500 transition-colors flex-shrink-0"
						/>
						<span className="text-sm font-medium">GitHub</span>
					</a>

					<a
						href="https://sacadalabs.com"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group min-h-[44px] touch-manipulation"
					>
						<Globe
							size={16}
							className="text-gray-600 group-hover:text-green-500 transition-colors flex-shrink-0"
						/>
						<span className="text-sm font-medium">Sacada Labs</span>
					</a>
				</div>
			</section>
		</main>
	);
}
