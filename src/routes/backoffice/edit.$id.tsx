import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BackofficeHeader } from "../../components/backoffice/Header";
import { SpatiForm } from "../../components/backoffice/SpatiForm";
import { Footer } from "../../components/Footer";
import { Loading } from "../../components/Loading";
import { backofficeBeforeLoad } from "../../lib/auth";
import { getAdminSpatiById } from "../../lib/backoffice/server-functions";

export const Route = createFileRoute("/backoffice/edit/$id")({
	beforeLoad: backofficeBeforeLoad,
	component: EditSpatiPage,
});

function EditSpatiPage() {
	const { id } = Route.useParams();
	const getSpatiFn = useServerFn(getAdminSpatiById);

	const {
		data: spati,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["admin-spati", id],
		queryFn: () => getSpatiFn({ data: id }),
	});

	if (isLoading) return <Loading />;

	if (error || !spati) {
		return (
			<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
				<h2 className="text-2xl font-black uppercase tracking-tight text-red-500 mb-4">
					Späti Not Found
				</h2>
				<p className="text-gray-400 mb-8 uppercase tracking-widest font-bold text-sm">
					The requested record could not be retrieved.
				</p>
				<button
					type="button"
					onClick={() => window.history.back()}
					className="px-6 py-3 bg-gray-800 text-white font-black uppercase tracking-wider rounded-xl hover:bg-gray-700 transition-all"
				>
					Go Back
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
			<BackofficeHeader />

			<main className="px-4 sm:px-6 py-12 max-w-5xl mx-auto">
				<div className="mb-10">
					<h2 className="text-3xl font-black uppercase tracking-tight">
						Edit Späti
					</h2>
					<p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-bold">
						Updating: {spati.name}
					</p>
				</div>

				<SpatiForm initialData={spati} />
			</main>

			<Footer />
		</div>
	);
}
