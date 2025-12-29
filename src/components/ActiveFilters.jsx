import React from 'react'

export const ActiveFilters = ({
    seatingFilter,
    toiletFilter,
    priceFilter,
    cardFilter,
    neighborhoodFilter,
    isOpenFilter,
    onClearSeating,
    onClearToilet,
    onClearPrice,
    onClearCard,
    onClearNeighborhood,
    onClearIsOpen,
    onClearAll,
}) => {
    const activeFilters = []

    if (seatingFilter !== 'all') {
        const labels = {
            indoor: 'Indoor',
            outdoor: 'Outdoor',
            both: 'Both',
        }
        activeFilters.push({
            key: 'seating',
            label: `Seating: ${labels[seatingFilter]}`,
            onClear: onClearSeating,
        })
    }

    if (toiletFilter !== 'all') {
        activeFilters.push({
            key: 'toilet',
            label: `Toilet: ${toiletFilter === 'yes' ? 'Yes' : 'No'}`,
            onClear: onClearToilet,
        })
    }

    if (priceFilter !== 'all') {
        const priceLabels = {
            '$': 'Cheap',
            '$$': 'Average',
            '$$$': 'Expensive',
        }
        activeFilters.push({
            key: 'price',
            label: `Price: ${priceFilter} ${priceLabels[priceFilter]}`,
            onClear: onClearPrice,
        })
    }

    if (cardFilter !== 'all') {
        activeFilters.push({
            key: 'card',
            label: `Payment: ${cardFilter === 'yes' ? 'Card' : 'Cash Only'}`,
            onClear: onClearCard,
        })
    }

    if (neighborhoodFilter !== 'all') {
        activeFilters.push({
            key: 'neighborhood',
            label: `Area: ${neighborhoodFilter}`,
            onClear: onClearNeighborhood,
        })
    }

    if (isOpenFilter !== 'all') {
        activeFilters.push({
            key: 'isOpen',
            label: `Status: ${isOpenFilter === 'yes' ? 'Open Now' : 'Closed'}`,
            onClear: onClearIsOpen,
        })
    }

    if (activeFilters.length === 0) {
        return null
    }

    return (
        <div className="active-filters-bar">
            <div className="active-filters-label">Active Filters:</div>
            <div className="active-filters-list">
                {activeFilters.map((filter) => (
                    <span key={filter.key} className="active-filter-chip">
                        <span className="active-filter-label">{filter.label}</span>
                        <button
                            className="active-filter-remove"
                            onClick={filter.onClear}
                            aria-label={`Remove ${filter.label} filter`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </span>
                ))}
            </div>
            <button className="clear-all-filters" onClick={onClearAll}>
                Clear All
            </button>
        </div>
    )
}
