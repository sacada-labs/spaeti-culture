import { useEffect, useState } from "react";

export type UserLocation = {
	latitude: number;
	longitude: number;
} | null;

export function useGeolocation() {
	const [location, setLocation] = useState<UserLocation>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [bypassed, setBypassed] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
					setIsLoading(false);
				},
				(err) => {
					setError(err.message);
					setIsLoading(false);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000, // 5 minutes cache
				},
			);
		} else if (typeof window !== "undefined") {
			setError("Geolocation is not supported by your browser");
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, []);

	const bypassError = () => {
		setBypassed(true);
		setIsLoading(false);
	};

	return { location, error: bypassed ? null : error, isLoading, bypassError };
}
