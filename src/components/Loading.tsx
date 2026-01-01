export function Loading() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh]">
			<div className="relative">
				<div className="w-16 h-16 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin"></div>
			</div>
			<p className="mt-6 text-gray-400 text-sm uppercase tracking-wide">
				Loading Spätis...
			</p>
		</div>
	);
}
