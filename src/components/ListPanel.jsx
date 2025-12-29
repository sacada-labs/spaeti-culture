import React from 'react'
import { SpaetiCard } from './SpaetiCard'

export const ListPanel = ({ isOpen, onClose, spaetis, onItemClick, mapInstance, onSpaetiSelect, selectedSpaeti }) => {
    const handleCardClick = (spaeti) => {
        if (mapInstance) {
            // Use flyTo for smooth animation
            mapInstance.flyTo([spaeti.lat, spaeti.lng], 16, {
                animate: true,
                duration: 0.5
            })
        }
        if (onItemClick) {
            onItemClick(spaeti)
        }
        if (onSpaetiSelect) {
            onSpaetiSelect(spaeti)
        }
        // Don't close on mobile - let user browse the list
    }

    return (
        <>
            <div className={`list-panel ${isOpen ? 'open' : ''}`}>
                <div className="list-header">
                    <h2>
                        {spaetis.length > 0 && spaetis[0]?.distance 
                            ? `Nearby Spaetis (${spaetis.length})`
                            : 'Nearby Spaetis'
                        }
                    </h2>
                    <button className="close-list" onClick={onClose} aria-label="Close list">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="list-content">
                    {spaetis.length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p>No Spaetis found matching your criteria.</p>
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
            {isOpen && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1999 }} onClick={onClose} />}
        </>
    )
}
