import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LayoutDashboard, LogOut, Plus } from "lucide-react";
import { logout } from "../../lib/backoffice/backoffice-auth";

export function BackofficeHeader() {
	const navigate = useNavigate();
	const logoutFn = useServerFn(logout);

	const mutation = useMutation({
		mutationFn: () => logoutFn(),
		onSuccess: () => {
			navigate({ to: "/backoffice/login" });
		},
	});

	return (
		<header className="px-6 py-8 border-b border-gray-900 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
				<div className="flex items-center gap-4">
					<Link to="/" className="flex items-center gap-3 group">
						<span className="text-2xl group-hover:scale-110 transition-transform">
							🍺
						</span>
						<div>
							<h1 className="text-xl font-black tracking-tight text-green-500 uppercase leading-none">
								Backoffice
							</h1>
							<p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
								Spati Culture Admin
							</p>
						</div>
					</Link>
				</div>

				<nav className="flex items-center gap-2 sm:gap-4">
					<Link
						to="/backoffice"
						className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-900 transition-all [&.active]:text-green-500 [&.active]:bg-green-500/10"
					>
						<LayoutDashboard size={14} />
						<span className="hidden sm:inline">Dashboard</span>
					</Link>
					<Link
						to="/backoffice/new"
						className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-900 transition-all [&.active]:text-green-500 [&.active]:bg-green-500/10"
					>
						<Plus size={14} />
						<span className="hidden sm:inline">Add New</span>
					</Link>
					<div className="w-px h-6 bg-gray-800 mx-2 hidden sm:block" />
					<button
						type="button"
						onClick={() => mutation.mutate()}
						disabled={mutation.isPending}
						className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
					>
						<LogOut size={14} />
						<span className="hidden sm:inline">Logout</span>
					</button>
				</nav>
			</div>
		</header>
	);
}
