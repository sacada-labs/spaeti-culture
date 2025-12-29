import { useMemo } from 'react'
import { useSpaetis } from './useSpaetis'
import { useGeolocation } from './useGeolocation'
import { calculateDistance } from '../utils/distance'
import { isSpaetiOpen } from '../utils/isOpen'

export const useFilteredSpaetis = (
    searchQuery, 
    seatingFilter, 
    toiletFilter,
    priceFilter,
    cardFilter,
    neighborhoodFilter,
    isOpenFilter,
    userLocation
) => {
    const { data: spaetis = [], isLoading, error } = useSpaetis()

    const filteredSpaetis = useMemo(() => {
        if (!spaetis.length) return []

        let filtered = spaetis

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(spaeti =>
                spaeti.name.toLowerCase().includes(query) ||
                spaeti.address.toLowerCase().includes(query) ||
                spaeti.description.toLowerCase().includes(query)
            )
        }

        // Apply seating type filter
        switch (seatingFilter) {
            case 'indoor':
                filtered = filtered.filter(s => s.seating.indoor && !s.seating.outdoor)
                break
            case 'outdoor':
                filtered = filtered.filter(s => s.seating.outdoor && !s.seating.indoor)
                break
            case 'both':
                filtered = filtered.filter(s => s.seating.indoor && s.seating.outdoor)
                break
            default:
                // 'all' - no additional filtering
                break
        }

        // Apply toilet filter
        if (toiletFilter !== 'all') {
            filtered = filtered.filter(s => 
                toiletFilter === 'yes' ? s.hasToilet === true : s.hasToilet === false
            )
        }

        // Apply price filter
        if (priceFilter !== 'all') {
            filtered = filtered.filter(s => s.price === priceFilter)
        }

        // Apply card payment filter
        if (cardFilter !== 'all') {
            filtered = filtered.filter(s => 
                cardFilter === 'yes' ? s.cardPayment === true : s.cardPayment === false
            )
        }

        // Apply neighborhood filter
        if (neighborhoodFilter !== 'all') {
            filtered = filtered.filter(s => s.neighborhood === neighborhoodFilter)
        }

        // Apply is open filter
        if (isOpenFilter !== 'all') {
            filtered = filtered.filter(s => {
                const isOpen = isSpaetiOpen(s.openingHours)
                return isOpenFilter === 'yes' ? isOpen : !isOpen
            })
        }

        // Calculate distances and add to each spaeti
        if (userLocation) {
            filtered = filtered.map(spaeti => ({
                ...spaeti,
                distance: calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    spaeti.lat,
                    spaeti.lng
                ),
            }))

            // Sort by distance (closest first)
            filtered.sort((a, b) => a.distance - b.distance)
        }

        return filtered
    }, [spaetis, searchQuery, seatingFilter, toiletFilter, priceFilter, cardFilter, neighborhoodFilter, isOpenFilter, userLocation])

    const counts = useMemo(() => {
        if (!spaetis.length) {
            return {
                seating: { all: 0, indoor: 0, outdoor: 0, both: 0 },
                toilet: { all: 0, yes: 0, no: 0 },
                price: { all: 0, '$': 0, '$$': 0, '$$$': 0 },
                card: { all: 0, yes: 0, no: 0 },
                isOpen: { all: 0, yes: 0, no: 0 },
            }
        }

        // Get unique neighborhoods
        const neighborhoods = [...new Set(spaetis.map(s => s.neighborhood))].sort()
        const neighborhoodCounts = { all: spaetis.length }
        neighborhoods.forEach(neighborhood => {
            neighborhoodCounts[neighborhood] = spaetis.filter(s => s.neighborhood === neighborhood).length
        })

        return {
            seating: {
                all: spaetis.length,
                indoor: spaetis.filter(s => s.seating.indoor && !s.seating.outdoor).length,
                outdoor: spaetis.filter(s => s.seating.outdoor && !s.seating.indoor).length,
                both: spaetis.filter(s => s.seating.indoor && s.seating.outdoor).length,
            },
            toilet: {
                all: spaetis.length,
                yes: spaetis.filter(s => s.hasToilet === true).length,
                no: spaetis.filter(s => s.hasToilet === false).length,
            },
            price: {
                all: spaetis.length,
                '$': spaetis.filter(s => s.price === '$').length,
                '$$': spaetis.filter(s => s.price === '$$').length,
                '$$$': spaetis.filter(s => s.price === '$$$').length,
            },
            card: {
                all: spaetis.length,
                yes: spaetis.filter(s => s.cardPayment === true).length,
                no: spaetis.filter(s => s.cardPayment === false).length,
            },
            neighborhood: neighborhoodCounts,
            isOpen: {
                all: spaetis.length,
                yes: spaetis.filter(s => isSpaetiOpen(s.openingHours)).length,
                no: spaetis.filter(s => !isSpaetiOpen(s.openingHours)).length,
            },
        }
    }, [spaetis])

    return {
        filteredSpaetis,
        allSpaetis: spaetis,
        counts,
        isLoading,
        error,
    }
}
