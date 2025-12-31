import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { AlertCircle, CheckCircle, Globe, Send, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { z } from "zod";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { db } from "../db";
import {
	hasToiletEnum,
	paymentEnum,
	priceLevelEnum,
	seatingEnum,
	submissions,
} from "../db/schema";

function Toast({
	message,
	type,
	onClose,
}: {
	message: string;
	type: "success" | "error";
	onClose: () => void;
}) {
	useEffect(() => {
		const timer = setTimeout(onClose, 5000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			role="alert"
			aria-live="polite"
			className={`toast-enter fixed bottom-24 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border ${
				type === "success"
					? "bg-green-500/10 border-green-500/30 text-green-400"
					: "bg-red-500/10 border-red-500/30 text-red-400"
			}`}
		>
			{type === "success" ? (
				<CheckCircle size={20} />
			) : (
				<AlertCircle size={20} />
			)}
			<span className="text-sm font-medium">{message}</span>
			<button
				type="button"
				onClick={onClose}
				className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
				aria-label="Dismiss notification"
			>
				<X size={14} />
			</button>
		</div>
	);
}

const submitSubmissionSchema = z.object({
	googleMapsUrl: z.string().url("Please enter a valid Google Maps URL"),
	seating: z.enum(seatingEnum.enumValues),
	hasToilet: z.enum(hasToiletEnum.enumValues),
	priceLevel: z.enum(priceLevelEnum.enumValues),
	payment: z.enum(paymentEnum.enumValues),
});

type SubmissionForm = z.infer<typeof submitSubmissionSchema>;

const submitSubmission = createServerFn()
	.inputValidator(submitSubmissionSchema)
	.handler(async ({ data }) => {
		await db.insert(submissions).values(data);
		return { success: true };
	});

export const Route = createFileRoute("/submit")({
	component: SubmitPage,
});

function SubmitPage() {
	const navigate = useNavigate();
	const submitSubmissionFn = useServerFn(submitSubmission);
	const googleMapsId = useId();
	const seatingId = useId();
	const toiletId = useId();
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);

	const [formData, setFormData] = useState<SubmissionForm>({
		googleMapsUrl: "",
		seating: "NO",
		hasToilet: "NO",
		priceLevel: "$$",
		payment: "CASH_ONLY",
	});

	const mutation = useMutation({
		mutationFn: async (data: SubmissionForm) => {
			return submitSubmissionFn({ data });
		},
		onSuccess: () => {
			setToast({
				message: "Thanks! Your submission is under review.",
				type: "success",
			});
			setTimeout(() => navigate({ to: "/" }), 1500);
		},
		onError: (error) => {
			setToast({
				message: error.message || "Something went wrong. Please try again.",
				type: "error",
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(formData);
	};

	const updateGoogleMapsUrl = (value: string) => {
		setFormData((prev) => ({ ...prev, googleMapsUrl: value }));
	};

	const updateSeating = (value: SubmissionForm["seating"]) => {
		setFormData((prev) => ({ ...prev, seating: value }));
	};

	const updateHasToilet = (value: SubmissionForm["hasToilet"]) => {
		setFormData((prev) => ({ ...prev, hasToilet: value }));
	};

	const updatePriceLevel = (value: SubmissionForm["priceLevel"]) => {
		setFormData((prev) => ({ ...prev, priceLevel: value }));
	};

	const updatePayment = (value: SubmissionForm["payment"]) => {
		setFormData((prev) => ({ ...prev, payment: value }));
	};

	return (
		<div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
			<Header />

			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}

			<main className="px-6 pb-32 max-w-3xl mx-auto">
				<form
					onSubmit={handleSubmit}
					className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-8"
				>
					<div className="space-y-6">
						<div>
							<label
								htmlFor={googleMapsId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Google Maps URL
							</label>
							<div className="relative">
								<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
									<Globe size={16} />
								</div>
								<input
									type="url"
									id={googleMapsId}
									name="googleMapsUrl"
									required
									value={formData.googleMapsUrl}
									onChange={(e) => updateGoogleMapsUrl(e.target.value)}
									placeholder="https://maps.app.goo.gl/..."
									className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor={seatingId}
									className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
								>
									Seating
								</label>
								<select
									id={seatingId}
									name="seating"
									required
									value={formData.seating}
									onChange={(e) =>
										updateSeating(e.target.value as SubmissionForm["seating"])
									}
									className="custom-select w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
								>
									<option value="NO">No</option>
									<option value="YES">Yes</option>
								</select>
							</div>
							<div>
								<label
									htmlFor={toiletId}
									className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
								>
									Toilet
								</label>
								<select
									id={toiletId}
									name="hasToilet"
									required
									value={formData.hasToilet}
									onChange={(e) =>
										updateHasToilet(
											e.target.value as SubmissionForm["hasToilet"],
										)
									}
									className="custom-select w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
								>
									<option value="NO">No</option>
									<option value="YES">Yes</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<fieldset>
								<legend className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
									Price Level
								</legend>
								<div className="flex gap-2 bg-black p-1.5 border border-gray-800 rounded-xl">
									{(["$", "$$", "$$$"] as const).map((level) => (
										<button
											type="button"
											key={level}
											onClick={() => updatePriceLevel(level)}
											className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
												formData.priceLevel === level
													? "bg-green-500 text-black"
													: "text-gray-500 hover:text-white"
											}`}
										>
											{level}
										</button>
									))}
								</div>
							</fieldset>
							<fieldset>
								<legend className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
									Payment
								</legend>
								<div className="flex gap-2 bg-black p-1.5 border border-gray-800 rounded-xl">
									{(
										[
											{ id: "CASH_ONLY", label: "Cash Only" },
											{ id: "CARD", label: "Card" },
										] as const
									).map((opt) => (
										<button
											type="button"
											key={opt.id}
											onClick={() => updatePayment(opt.id)}
											className={`flex-1 py-2 rounded-lg text-[10px] uppercase font-bold transition-all ${
												formData.payment === opt.id
													? "bg-purple-500 text-white"
													: "text-gray-500 hover:text-white"
											}`}
										>
											{opt.label}
										</button>
									))}
								</div>
							</fieldset>
						</div>
					</div>

					<button
						type="submit"
						disabled={mutation.isPending}
						className="w-full min-h-[52px] py-4 bg-green-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
					>
						{mutation.isPending ? (
							<div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
						) : (
							<>
								<Send
									size={18}
									className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
								/>
								Submit Spot
							</>
						)}
					</button>
				</form>
			</main>

			<Footer />
		</div>
	);
}
