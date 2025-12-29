import React, { useState } from 'react'
import { ActiveFilters } from './ActiveFilters'

export const Filters = ({ 
    seatingFilter, 
    onSeatingFilterChange, 
    toiletFilter,
    onToiletFilterChange,
    priceFilter,
    onPriceFilterChange,
    cardFilter,
    onCardFilterChange,
    neighborhoodFilter,
    onNeighborhoodFilterChange,
    isOpenFilter,
    onIsOpenFilterChange,
    counts,
    onClearAllFilters
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const seatingFilters = [
        { key: 'all', label: 'All' },
        { key: 'indoor', label: 'Indoor' },
        { key: 'outdoor', label: 'Outdoor' },
        { key: 'both', label: 'Both' },
    ]

    const toiletFilters = [
        { key: 'all', label: 'All' },
        { key: 'yes', label: '🚽 Toilet' },
        { key: 'no', label: 'No Toilet' },
    ]

    const priceFilters = [
        { key: 'all', label: 'All Prices' },
        { key: '$', label: '$ Cheap' },
        { key: '$$', label: '$$ Average' },
        { key: '$$$', label: '$$$ Expensive' },
    ]

    const cardFilters = [
        { key: 'all', label: 'All' },
        { key: 'yes', label: '💳 Card' },
        { key: 'no', label: 'Cash Only' },
    ]

    const neighborhoodFilters = [
        { key: 'all', label: 'All Areas' },
        { key: 'Kreuzberg', label: 'Kreuzberg' },
        { key: 'Friedrichshain', label: 'Friedrichshain' },
        { key: 'Prenzlauer Berg', label: 'Prenzlauer Berg' },
        { key: 'Mitte', label: 'Mitte' },
        { key: 'Neukölln', label: 'Neukölln' },
        { key: 'Charlottenburg', label: 'Charlottenburg' },
        { key: 'Tempelhof', label: 'Tempelhof' },
        { key: 'Wedding', label: 'Wedding' },
    ]

    const isOpenFilters = [
        { key: 'all', label: 'All' },
        { key: 'yes', label: '🟢 Open Now' },
        { key: 'no', label: '🔴 Closed' },
    ]

    const handleClearSeating = () => onSeatingFilterChange('all')
    const handleClearToilet = () => onToiletFilterChange('all')
    const handleClearPrice = () => onPriceFilterChange('all')
    const handleClearCard = () => onCardFilterChange('all')
    const handleClearNeighborhood = () => onNeighborhoodFilterChange('all')
    const handleClearIsOpen = () => onIsOpenFilterChange('all')
    const handleClearAll = () => {
        if (onClearAllFilters) {
            onClearAllFilters()
        } else {
            handleClearSeating()
            handleClearToilet()
            handleClearPrice()
            handleClearCard()
            handleClearNeighborhood()
            handleClearIsOpen()
        }
    }

    const hasActiveFilters = 
        seatingFilter !== 'all' || 
        toiletFilter !== 'all' || 
        priceFilter !== 'all' || 
        cardFilter !== 'all' ||
        neighborhoodFilter !== 'all' ||
        isOpenFilter !== 'all'

    return (
        <div className="filters-wrapper">
            <ActiveFilters
                seatingFilter={seatingFilter}
                toiletFilter={toiletFilter}
                priceFilter={priceFilter}
                cardFilter={cardFilter}
                neighborhoodFilter={neighborhoodFilter}
                isOpenFilter={isOpenFilter}
                onClearSeating={handleClearSeating}
                onClearToilet={handleClearToilet}
                onClearPrice={handleClearPrice}
                onClearCard={handleClearCard}
                onClearNeighborhood={handleClearNeighborhood}
                onClearIsOpen={handleClearIsOpen}
                onClearAll={handleClearAll}
            />
            <button 
                className="filter-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <span className="filter-toggle-label">
                    {isExpanded ? 'Hide Filters' : 'Show Filters'}
                </span>
                {hasActiveFilters && !isExpanded && (
                    <span className="filter-toggle-badge">
                        {[seatingFilter, toiletFilter, priceFilter, cardFilter, neighborhoodFilter, isOpenFilter].filter(f => f !== 'all').length}
                    </span>
                )}
                <svg 
                    className={`filter-toggle-icon ${isExpanded ? 'expanded' : ''}`}
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {isExpanded && (
                <div className="filters-container">
                <div className="filter-group">
                    <div className="filter-group-label">Seating</div>
                    <div className="filter-group-buttons">
                        {seatingFilters.map((filter) => (
                            <button
                                key={filter.key}
                                className={`filter-btn ${seatingFilter === filter.key ? 'active' : ''}`}
                                onClick={() => onSeatingFilterChange(filter.key)}
                            >
                                <span>{filter.label}</span>
                                <span className="count">
                                    {counts.seating?.[filter.key] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-group-label">Toilet</div>
                    <div className="filter-group-buttons">
                        {toiletFilters.map((filter) => (
                            <button
                                key={filter.key}
                                className={`filter-btn ${toiletFilter === filter.key ? 'active' : ''}`}
                                onClick={() => onToiletFilterChange(filter.key)}
                            >
                                <span>{filter.label}</span>
                                <span className="count">
                                    {counts.toilet?.[filter.key] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-group-label">Price</div>
                    <div className="filter-group-buttons">
                        {priceFilters.map((filter) => (
                            <button
                                key={filter.key}
                                className={`filter-btn ${priceFilter === filter.key ? 'active' : ''}`}
                                onClick={() => onPriceFilterChange(filter.key)}
                            >
                                <span>{filter.label}</span>
                                <span className="count">
                                    {counts.price?.[filter.key] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-group-label">Payment</div>
                    <div className="filter-group-buttons">
                        {cardFilters.map((filter) => (
                            <button
                                key={filter.key}
                                className={`filter-btn ${cardFilter === filter.key ? 'active' : ''}`}
                                onClick={() => onCardFilterChange(filter.key)}
                            >
                                <span>{filter.label}</span>
                                <span className="count">
                                    {counts.card?.[filter.key] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-group-label">Neighborhood</div>
                    <div className="filter-group-buttons">
                        {neighborhoodFilters.map((filter) => (
                            <button
                                key={filter.key}
                                className={`filter-btn ${neighborhoodFilter === filter.key ? 'active' : ''}`}
                                onClick={() => onNeighborhoodFilterChange(filter.key)}
                            >
                                <span>{filter.label}</span>
                                <span className="count">
                                    {counts.neighborhood?.[filter.key] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-group-label">Status</div>
                    <div className="filter-group-buttons">
                        {isOpenFilters.map((filter) => (
                            <button
                                key={filter.key}
                                className={`filter-btn ${isOpenFilter === filter.key ? 'active' : ''}`}
                                onClick={() => onIsOpenFilterChange(filter.key)}
                            >
                                <span>{filter.label}</span>
                                <span className="count">
                                    {counts.isOpen?.[filter.key] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}
