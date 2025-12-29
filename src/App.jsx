import React, { useState } from 'react'
import { Header } from './components/Header'
import { Filters } from './components/Filters'
import { SpaetiList } from './components/SpaetiList'
import { Loading } from './components/Loading'
import { SpaetiModal } from './components/SpaetiModal'
import { Footer } from './components/Footer'
import { useFilteredSpaetis } from './hooks/useFilteredSpaetis'
import { useGeolocation } from './hooks/useGeolocation'

function App() {
    const [seatingFilter, setSeatingFilter] = useState('all')
    const [toiletFilter, setToiletFilter] = useState('all')
    const [priceFilter, setPriceFilter] = useState('all')
    const [cardFilter, setCardFilter] = useState('all')
    const [neighborhoodFilter, setNeighborhoodFilter] = useState('all')
    const [isOpenFilter, setIsOpenFilter] = useState('all')
    const [selectedSpaeti, setSelectedSpaeti] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Get user location automatically on first load
    const {
        data: userLocation,
        isLoading: locationLoading,
        error: locationError,
    } = useGeolocation(true) // Automatically enabled

    const { filteredSpaetis, counts, isLoading, error } = useFilteredSpaetis(
        '',
        seatingFilter,
        toiletFilter,
        priceFilter,
        cardFilter,
        neighborhoodFilter,
        isOpenFilter,
        userLocation
    )

    if (error) {
        return (
            <div style={{ padding: '32px', textAlign: 'center' }}>
                <p>Error loading Spaetis: {error.message}</p>
            </div>
        )
    }

    return (
        <div className="app">
            <Header />
            <Filters
                seatingFilter={seatingFilter}
                onSeatingFilterChange={setSeatingFilter}
                toiletFilter={toiletFilter}
                onToiletFilterChange={setToiletFilter}
                priceFilter={priceFilter}
                onPriceFilterChange={setPriceFilter}
                cardFilter={cardFilter}
                onCardFilterChange={setCardFilter}
                neighborhoodFilter={neighborhoodFilter}
                onNeighborhoodFilterChange={setNeighborhoodFilter}
                isOpenFilter={isOpenFilter}
                onIsOpenFilterChange={setIsOpenFilter}
                counts={counts}
                onClearAllFilters={() => {
                    setSeatingFilter('all')
                    setToiletFilter('all')
                    setPriceFilter('all')
                    setCardFilter('all')
                    setNeighborhoodFilter('all')
                    setIsOpenFilter('all')
                }}
            />
            <SpaetiList
                spaetis={filteredSpaetis}
                selectedSpaeti={selectedSpaeti}
                onSpaetiSelect={(spaeti) => {
                    setSelectedSpaeti(spaeti)
                    setIsModalOpen(true)
                }}
                isLoading={isLoading || locationLoading}
            />
            <SpaetiModal
                spaeti={selectedSpaeti}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedSpaeti(null)
                }}
            />
            <Loading isLoading={isLoading || locationLoading} />
            <Footer />
        </div>
    )
}

export default App
