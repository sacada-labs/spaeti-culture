import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Lock, User } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { login, type loginSchema } from "../../lib/auth";

export const Route = createFileRoute("/backoffice/login")({
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const loginFn = useServerFn(login);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const mutation = useMutation({
		mutationFn: async (data: z.infer<typeof loginSchema>) => {
			return loginFn({ data });
		},
		onSuccess: () => {
			navigate({ to: "/backoffice" });
		},
		onError: (err) => {
			setError(err.message || "Invalid credentials");
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!username || !password) {
			setError("Please enter a username and password");
			return;
		}
		mutation.mutate({ username, password });
	};

	return (
		<main className="px-4 sm:px-6 py-12 max-w-md mx-auto">
			<div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
				<div className="text-center">
					<h2 className="text-3xl font-black uppercase tracking-tight text-green-500">
						Backoffice
					</h2>
					<p className="text-gray-400 text-sm mt-2 uppercase tracking-widest font-bold">
						Restricted Area
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<div>
							<label
								htmlFor="username"
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
							>
								Username
							</label>
							<div className="relative">
								<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
									<User size={16} />
								</div>
								<input
									type="text"
									name="username"
									required
									className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
									placeholder="Enter username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
									<Lock size={16} />
								</div>
								<input
									type="password"
									name="password"
									required
									className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
									placeholder="Enter password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
					</div>

					{error && (
						<p className="text-red-500 text-[10px] font-black uppercase tracking-wider text-center">
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={mutation.isPending}
						className="w-full min-h-[48px] py-4 bg-green-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
					>
						{mutation.isPending ? (
							<div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
						) : (
							"Login"
						)}
					</button>
				</form>
			</div>
		</main>
	);
}
