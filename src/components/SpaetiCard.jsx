import React from 'react'
import { formatDistance } from '../utils/distance'

export const SpaetiCard = ({ spaeti, onClick, isSelected }) => {
    const seatingBadges = []
    if (spaeti.seating.indoor) {
        seatingBadges.push(
            <span key="indoor" className="seating-badge indoor">
                🏠 Indoor
            </span>
        )
    }
    if (spaeti.seating.outdoor) {
        seatingBadges.push(
            <span key="outdoor" className="seating-badge outdoor">
                🌳 Outdoor
            </span>
        )
    }

    const criteriaBadges = []
    if (spaeti.hasToilet) {
        criteriaBadges.push(
            <span key="toilet" className="criteria-badge toilet">
                🚽 Toilet
            </span>
        )
    }
    if (spaeti.cardPayment) {
        criteriaBadges.push(
            <span key="card" className="criteria-badge card">
                💳 Card
            </span>
        )
    }
    if (spaeti.price) {
        const priceLabels = { '$': 'Cheap', '$$': 'Average', '$$$': 'Expensive' }
        criteriaBadges.push(
            <span key="price" className={`criteria-badge price price-${spaeti.price.length}`}>
                {spaeti.price} {priceLabels[spaeti.price]}
            </span>
        )
    }

    return (
        <div
            className={`spaeti-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick && onClick(spaeti)}
        >
            <div className="spaeti-card-header">
                <h3 className="spaeti-card-title">{spaeti.name}</h3>
                {spaeti.distance && (
                    <div className="spaeti-card-distance">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {formatDistance(spaeti.distance)}
                    </div>
                )}
            </div>
            <div className="spaeti-card-address">{spaeti.address}</div>
            <p className="spaeti-card-description">{spaeti.description}</p>
            <div className="spaeti-card-seating">
                {seatingBadges}
            </div>
            {criteriaBadges.length > 0 && (
                <div className="spaeti-card-criteria">
                    {criteriaBadges}
                </div>
            )}
        </div>
    )
}
