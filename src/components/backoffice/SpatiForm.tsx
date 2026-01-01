import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Globe, MapPin, Save, X } from "lucide-react";
import { useId, useState } from "react";
import type { z } from "zod";
import {
	hasToiletEnum,
	paymentEnum,
	priceLevelEnum,
	seatingEnum,
} from "../../db/schema";
import {
	type spatiSchema,
	upsertSpati,
} from "../../lib/backoffice/server-functions";

interface SpatiFormProps {
	initialData?: {
		id?: number;
		name: string | null;
		address: string | null;
		neighborhood: string | null;
		zipCode: string | null;
		googleMapsUrl: string | null;
		seating: "YES" | "NO";
		hasToilet: "YES" | "NO";
		priceLevel: "$" | "$$" | "$$$";
		payment: "CARD" | "CASH_ONLY";
		location: { x: number; y: number } | null;
		reviewedAt: Date | null;
	};
}

export function SpatiForm({ initialData }: SpatiFormProps) {
	const navigate = useNavigate();
	const upsertFn = useServerFn(upsertSpati);
	const [error, setError] = useState<string | null>(null);

	const nameId = useId();
	const googleMapsUrlId = useId();
	const addressId = useId();
	const neighborhoodId = useId();
	const zipCodeId = useId();
	const seatingId = useId();
	const hasToiletId = useId();
	const priceLevelId = useId();
	const paymentId = useId();
	const latitudeId = useId();
	const longitudeId = useId();

	const mutation = useMutation({
		mutationFn: async (data: z.infer<typeof spatiSchema>) => {
			return upsertFn({ data });
		},
		onSuccess: () => {
			navigate({ to: "/backoffice" });
		},
		onError: (err) => {
			setError(err.message || "Failed to save Späti");
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const data = {
			id: initialData?.id,
			name: formData.get("name") as string,
			address: formData.get("address") as string,
			neighborhood: (formData.get("neighborhood") as string) || undefined,
			zipCode: (formData.get("zipCode") as string) || undefined,
			googleMapsUrl: formData.get("googleMapsUrl") as string,
			seating: formData.get("seating") as "YES" | "NO",
			hasToilet: formData.get("hasToilet") as "YES" | "NO",
			priceLevel: formData.get("priceLevel") as "$" | "$$" | "$$$",
			payment: formData.get("payment") as "CARD" | "CASH_ONLY",
			longitude: parseFloat(formData.get("longitude") as string),
			latitude: parseFloat(formData.get("latitude") as string),
			reviewedAt: initialData?.reviewedAt?.toISOString() || null,
		};

		mutation.mutate(data);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 sm:space-y-8 bg-gray-900/40 border border-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Basic Info */}
				<div className="space-y-6">
					<h3 className="text-sm font-black uppercase tracking-widest text-green-500 border-b border-gray-800 pb-2">
						Basic Information
					</h3>

					<div className="space-y-4">
						<div>
							<label
								htmlFor={nameId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Späti Name
							</label>
							<input
								type="text"
								id={nameId}
								name="name"
								required
								defaultValue={initialData?.name || ""}
								className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
								placeholder="e.g. Späti am Schlesi"
							/>
						</div>

						<div>
							<label
								htmlFor={googleMapsUrlId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Google Maps URL
							</label>
							<div className="relative">
								<Globe
									size={14}
									className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
								/>
								<input
									type="url"
									id={googleMapsUrlId}
									name="googleMapsUrl"
									required
									defaultValue={initialData?.googleMapsUrl || ""}
									className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
									placeholder="https://maps.app.goo.gl/..."
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor={addressId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Address
							</label>
							<div className="relative">
								<MapPin
									size={14}
									className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
								/>
								<input
									type="text"
									id={addressId}
									name="address"
									required
									defaultValue={initialData?.address || ""}
									className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
									placeholder="e.g. Skalitzer Str. 100"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor={neighborhoodId}
									className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
								>
									Neighborhood
								</label>
								<input
									type="text"
									id={neighborhoodId}
									name="neighborhood"
									defaultValue={initialData?.neighborhood || ""}
									className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
									placeholder="e.g. Kreuzberg"
								/>
							</div>
							<div>
								<label
									htmlFor={zipCodeId}
									className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
								>
									ZIP Code
								</label>
								<input
									type="text"
									id={zipCodeId}
									name="zipCode"
									defaultValue={initialData?.zipCode || ""}
									className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
									placeholder="e.g. 10997"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Features & Location */}
				<div className="space-y-6">
					<h3 className="text-sm font-black uppercase tracking-widest text-purple-500 border-b border-gray-800 pb-2">
						Features & Location
					</h3>

					<div className="grid grid-cols-2 gap-4">
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
								defaultValue={initialData?.seating || "NO"}
								className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
							>
								{seatingEnum.enumValues.map((v) => (
									<option key={v} value={v}>
										{v}
									</option>
								))}
							</select>
						</div>
						<div>
							<label
								htmlFor={hasToiletId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Toilet
							</label>
							<select
								id={hasToiletId}
								name="hasToilet"
								required
								defaultValue={initialData?.hasToilet || "NO"}
								className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
							>
								{hasToiletEnum.enumValues.map((v) => (
									<option key={v} value={v}>
										{v}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label
								htmlFor={priceLevelId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Price Level
							</label>
							<select
								id={priceLevelId}
								name="priceLevel"
								required
								defaultValue={initialData?.priceLevel || "$$"}
								className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
							>
								{priceLevelEnum.enumValues.map((v) => (
									<option key={v} value={v}>
										{v}
									</option>
								))}
							</select>
						</div>
						<div>
							<label
								htmlFor={paymentId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Payment
							</label>
							<select
								id={paymentId}
								name="payment"
								required
								defaultValue={initialData?.payment || "CASH_ONLY"}
								className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
							>
								{paymentEnum.enumValues.map((v) => (
									<option key={v} value={v}>
										{v}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 p-4 bg-black rounded-2xl border border-gray-800">
						<div>
							<label
								htmlFor={latitudeId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Latitude
							</label>
							<input
								type="number"
								step="any"
								id={latitudeId}
								name="latitude"
								required
								defaultValue={initialData?.location?.y || ""}
								className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-green-500 transition-colors"
								placeholder="52.5200"
							/>
						</div>
						<div>
							<label
								htmlFor={longitudeId}
								className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2"
							>
								Longitude
							</label>
							<input
								type="number"
								step="any"
								id={longitudeId}
								name="longitude"
								required
								defaultValue={initialData?.location?.x || ""}
								className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-green-500 transition-colors"
								placeholder="13.4050"
							/>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<p className="text-red-500 text-[10px] font-black uppercase tracking-wider text-center">
					{error}
				</p>
			)}

			<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-800">
				<button
					type="submit"
					disabled={mutation.isPending}
					className="flex-1 min-h-[48px] py-4 bg-green-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-green-500/10"
				>
					{mutation.isPending ? (
						<div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
					) : (
						<>
							<Save size={18} />
							{initialData?.id ? "Update Späti" : "Create Späti"}
						</>
					)}
				</button>
				<button
					type="button"
					onClick={() => navigate({ to: "/backoffice" })}
					className="px-8 py-4 min-h-[48px] bg-gray-800 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
				>
					<X size={18} />
					Cancel
				</button>
			</div>
		</form>
	);
}
