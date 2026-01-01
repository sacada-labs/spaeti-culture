import { createFileRoute } from "@tanstack/react-router";
import { SpatiForm } from "../../components/backoffice/SpatiForm";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { backofficeBeforeLoad } from "../../lib/auth";

export const Route = createFileRoute("/backoffice/new")({
	beforeLoad: backofficeBeforeLoad,
	component: NewSpatiPage,
});

function NewSpatiPage() {
	return (
		<div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
			<Header />

			<main className="px-4 sm:px-6 py-12 max-w-5xl mx-auto">
				<div className="mb-10">
					<h2 className="text-3xl font-black uppercase tracking-tight">
						Add New Späti
					</h2>
					<p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-bold">
						Create a new record in the database
					</p>
				</div>

				<SpatiForm />
			</main>

			<Footer />
		</div>
	);
}
