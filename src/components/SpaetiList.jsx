import React from 'react'
import { SpaetiCard } from './SpaetiCard'

export const SpaetiList = ({ spaetis, selectedSpaeti, onSpaetiSelect, isLoading }) => {
    const handleCardClick = (spaeti) => {
        if (onSpaetiSelect) {
            onSpaetiSelect(spaeti)
        }
    }

    if (isLoading) {
        return (
            <div className="spaeti-list-container">
                <div className="loading-message">
                    <div className="spinner"></div>
                    <p>Loading Spaetis...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="spaeti-list-container">
            <div className="spaeti-list-content">
                {spaetis.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                        <p>No Spaetis found matching your filters.</p>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Try selecting a different seating type.
                        </p>
                    </div>
                ) : (
                    <div className="spaeti-cards-container">
                        {spaetis.map((spaeti) => (
                            <SpaetiCard
                                key={spaeti.id}
                                spaeti={spaeti}
                                onClick={handleCardClick}
                                isSelected={selectedSpaeti?.id === spaeti.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
