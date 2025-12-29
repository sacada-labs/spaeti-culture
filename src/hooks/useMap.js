import { useEffect, useRef } from 'react'
import L from 'leaflet'

export const useMap = (center, zoom) => {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        // Initialize map
        const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
            boxZoom: false,
            keyboard: true,
            dragging: true,
        }).setView(center, zoom)

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map)

        mapInstanceRef.current = map

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [center, zoom])

    return { mapRef, mapInstance: mapInstanceRef.current }
}
