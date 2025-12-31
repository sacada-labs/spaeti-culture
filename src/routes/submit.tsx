import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { AlertCircle, CheckCircle, Globe, Send } from "lucide-react";
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
		<>
			{/* Backdrop overlay that blocks interaction */}
			<div
				className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
				aria-hidden="true"
			>
				{/* Centered toast modal */}
				<div
					role="alert"
					aria-live="polite"
					className={`toast-enter flex items-center gap-4 sm:gap-6 px-6 sm:px-8 py-5 sm:py-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 w-full max-w-lg ${
						type === "success"
							? "bg-gray-950 border-green-500 text-green-400"
							: "bg-gray-950 border-red-500 text-red-400"
					}`}
				>
					<div
						className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
							type === "success" ? "bg-green-500/20" : "bg-red-500/20"
						}`}
					>
						{type === "success" ? (
							<CheckCircle size={32} className="sm:w-8 sm:h-8" />
						) : (
							<AlertCircle size={32} className="sm:w-8 sm:h-8" />
						)}
					</div>
					<div className="flex flex-col">
						<span className="text-sm sm:text-base font-black uppercase tracking-widest opacity-50">
							{type === "success" ? "Success" : "Error"}
						</span>
						<span className="text-base sm:text-lg font-bold text-white">
							{message}
						</span>
					</div>
				</div>
			</div>
		</>
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
	const [formError, setFormError] = useState<string | null>(null);

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
		const result = submitSubmissionSchema.safeParse(formData);
		if (!result.success) {
			setFormError(result.error.issues[0].message);
			return;
		}
		setFormError(null);
		mutation.mutate(formData);
	};

	const updateGoogleMapsUrl = (value: string) => {
		setFormData((prev) => ({ ...prev, googleMapsUrl: value }));
		if (formError) setFormError(null);
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

			<main className="px-4 sm:px-6 pb-32 max-w-3xl mx-auto">
				<form
					onSubmit={handleSubmit}
					className="bg-gray-900/40 border border-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
				>
					<div className="space-y-6">
						<div>
							<label
								htmlFor={googleMapsId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
							>
								Google Maps URL
							</label>
							<div className="relative">
								<div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
									className={`w-full bg-black border ${
										formError ? "border-red-500" : "border-gray-800"
									} rounded-xl pl-10 sm:pl-12 pr-4 py-3.5 sm:py-3 text-base sm:text-sm focus:outline-none focus:border-green-500 transition-colors touch-manipulation`}
								/>
							</div>
							{formError ? (
								<p className="mt-2 text-red-500 text-[10px] font-bold uppercase tracking-wider">
									{formError}
								</p>
							) : (
								<p className="mt-2 text-gray-500 text-[10px] uppercase tracking-wider">
									Paste the link from the "Share" button in Google Maps.
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
							<div>
								<label
									htmlFor={seatingId}
									className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
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
									className="custom-select w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 sm:py-3 text-base sm:text-sm focus:outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer text-gray-300 touch-manipulation min-h-[48px]"
								>
									<option value="NO">No</option>
									<option value="YES">Yes</option>
								</select>
							</div>
							<div>
								<label
									htmlFor={toiletId}
									className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
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
									className="custom-select w-full bg-black border border-gray-800 rounded-xl px-4 py-3.5 sm:py-3 text-base sm:text-sm focus:outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer text-gray-300 touch-manipulation min-h-[48px]"
								>
									<option value="NO">No</option>
									<option value="YES">Yes</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
							<fieldset>
								<legend className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
									Price Level
								</legend>
								<div className="flex gap-2 bg-black p-1.5 border border-gray-800 rounded-xl">
									{(["$", "$$", "$$$"] as const).map((level) => (
										<button
											type="button"
											key={level}
											onClick={() => updatePriceLevel(level)}
											className={`flex-1 min-h-[44px] py-2 rounded-lg text-xs font-bold transition-all touch-manipulation ${
												formData.priceLevel === level
													? "bg-green-500 text-black"
													: "text-gray-400 hover:text-white"
											}`}
										>
											{level}
										</button>
									))}
								</div>
							</fieldset>
							<fieldset>
								<legend className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
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
											className={`flex-1 min-h-[44px] py-2 rounded-lg text-[10px] uppercase font-bold transition-all touch-manipulation ${
												formData.payment === opt.id
													? "bg-purple-500 text-white"
													: "text-gray-400 hover:text-white"
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
						disabled={mutation.isPending || toast !== null}
						className="w-full min-h-[52px] py-4 bg-green-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group touch-manipulation"
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
