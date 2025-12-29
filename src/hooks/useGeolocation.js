import { useQuery } from '@tanstack/react-query'

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Geolocation success:', position.coords)
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                })
            },
            (error) => {
                console.error('Geolocation error:', error)
                let errorMessage = 'Unable to get your location'
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied'
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable'
                        break
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out'
                        break
                }
                reject(new Error(errorMessage))
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0, // Always get fresh location
            }
        )
    })
}

export const useGeolocation = (enabled = true) => {
    const isGeolocationSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator
    
    return useQuery({
        queryKey: ['geolocation'],
        queryFn: getCurrentPosition,
        enabled: enabled && isGeolocationSupported,
        staleTime: 1000 * 60 * 5, // Consider location fresh for 5 minutes
        retry: 1, // Retry once on failure
        refetchOnWindowFocus: false,
        retryDelay: 1000,
    })
}
