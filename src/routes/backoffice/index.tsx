import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Edit2,
	ExternalLink,
	MapPin,
	Plus,
	Trash2,
} from "lucide-react";
import { BackofficeHeader } from "../../components/backoffice/Header";
import { Footer } from "../../components/Footer";
import { Loading } from "../../components/Loading";
import { backofficeBeforeLoad } from "../../lib/auth";
import {
	deleteSpati,
	getAdminSpatis,
	toggleSpatiReview,
} from "../../lib/backoffice/server-functions";

export const Route = createFileRoute("/backoffice/")({
	beforeLoad: backofficeBeforeLoad,
	component: AdminDashboard,
});

function AdminDashboard() {
	const queryClient = useQueryClient();
	const getSpatisFn = useServerFn(getAdminSpatis);
	const deleteSpatiFn = useServerFn(deleteSpati);
	const toggleReviewFn = useServerFn(toggleSpatiReview);

	const {
		data: spaties,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["admin-spaties"],
		queryFn: () => getSpatisFn(),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteSpatiFn({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-spaties"] });
		},
	});

	const toggleReviewMutation = useMutation({
		mutationFn: ({ id, reviewed }: { id: number; reviewed: boolean }) =>
			toggleReviewFn({ data: { id, reviewed } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-spaties"] });
		},
	});

	if (isLoading) return <Loading />;

	return (
		<div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
			<BackofficeHeader />

			<main className="px-4 sm:px-6 py-12 max-w-7xl mx-auto">
				<div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
					<div>
						<h2 className="text-3xl font-black uppercase tracking-tight">
							Manage Spätis
						</h2>
						<p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-bold">
							{spaties?.length || 0} Total Records
						</p>
					</div>
					<Link
						to="/backoffice/new"
						className="flex items-center gap-3 px-6 py-3 bg-green-500 text-black font-black uppercase tracking-wider rounded-2xl hover:bg-green-400 transition-all shadow-xl shadow-green-500/10"
					>
						<Plus size={18} />
						Add New Späti
					</Link>
				</div>

				{error && (
					<div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-8 flex items-center gap-4 text-red-400">
						<AlertTriangle size={20} />
						<p className="text-sm font-bold uppercase tracking-wider">
							Failed to load Spätis: {(error as Error).message}
						</p>
					</div>
				)}

				<div className="grid grid-cols-1 gap-4">
					{spaties?.map((spati) => (
						<div
							key={spati.id}
							className="group bg-gray-900/40 border border-gray-800 rounded-2xl p-4 sm:p-6 hover:border-gray-700 transition-all flex flex-col sm:flex-row sm:items-center gap-6"
						>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-3 mb-2">
									<h3 className="text-lg font-bold truncate">
										{spati.name || "Unnamed Späti"}
									</h3>
									{spati.reviewedAt ? (
										<span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
											<CheckCircle size={10} />
											Reviewed
										</span>
									) : (
										<span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
											<Clock size={10} />
											Pending
										</span>
									)}
								</div>

								<div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
									<MapPin size={12} />
									<p className="truncate">{spati.address}</p>
								</div>

								<p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
									Updated {new Date(spati.updatedAt).toLocaleDateString()}
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<a
									href={spati.googleMapsUrl || "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 bg-gray-800 text-gray-400 rounded-xl hover:text-white hover:bg-gray-700 transition-all"
									title="View on Maps"
								>
									<ExternalLink size={16} />
								</a>

								<button
									type="button"
									onClick={() =>
										toggleReviewMutation.mutate({
											id: spati.id,
											reviewed: !spati.reviewedAt,
										})
									}
									disabled={toggleReviewMutation.isPending}
									className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
										spati.reviewedAt
											? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
											: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
									}`}
								>
									{spati.reviewedAt ? "Unapprove" : "Approve"}
								</button>

								<Link
									to="/backoffice/edit/$id"
									params={{ id: spati.id.toString() }}
									className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all"
									title="Edit"
								>
									<Edit2 size={16} />
								</Link>

								<button
									type="button"
									onClick={() => {
										if (
											confirm("Are you sure you want to delete this Späti?")
										) {
											deleteMutation.mutate(spati.id);
										}
									}}
									disabled={deleteMutation.isPending}
									className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50"
									title="Delete"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					))}

					{spaties?.length === 0 && (
						<div className="text-center py-20 bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl">
							<p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
								No Spätis found in database
							</p>
							<Link
								to="/backoffice/new"
								className="inline-flex items-center gap-2 mt-4 text-green-500 hover:text-green-400 font-bold uppercase tracking-wider text-xs"
							>
								<Plus size={14} />
								Add your first one
							</Link>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
