import React, { useEffect } from 'react'

export const SpaetiModal = ({ spaeti, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen || !spaeti) return null

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${spaeti.lat},${spaeti.lng}`

    const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    }

    const getCurrentDay = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        return days[new Date().getDay()]
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

        return (
            <div className="rating-stars">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="star full">★</span>
                ))}
                {hasHalfStar && <span className="star half">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="star empty">★</span>
                ))}
                <span className="rating-value">{rating.toFixed(1)}</span>
            </div>
        )
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {spaeti.pictures && spaeti.pictures.length > 0 && (
                    <div className="modal-images">
                        {spaeti.pictures.map((picture, index) => (
                            <img 
                                key={index} 
                                src={picture} 
                                alt={`${spaeti.name} - Image ${index + 1}`}
                                className="modal-image"
                            />
                        ))}
                    </div>
                )}

                <div className="modal-body">
                    <h2 className="modal-title">{spaeti.name}</h2>
                    
                    {spaeti.rating && (
                        <div className="modal-rating">
                            {renderStars(spaeti.rating)}
                        </div>
                    )}

                    <div className="modal-section">
                        <h3 className="modal-section-title">Address</h3>
                        <p className="modal-section-content">{spaeti.address}</p>
                        <a 
                            href={googleMapsUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="modal-google-maps-link"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            Open in Google Maps
                        </a>
                    </div>

                    {spaeti.openingHours && (
                        <div className="modal-section">
                            <h3 className="modal-section-title">Opening Hours</h3>
                            <div className="modal-hours">
                                {Object.entries(spaeti.openingHours).map(([day, hours]) => {
                                    const isToday = day === getCurrentDay()
                                    return (
                                        <div 
                                            key={day} 
                                            className={`modal-hour-row ${isToday ? 'today' : ''}`}
                                        >
                                            <span className="modal-hour-day">{dayLabels[day]}</span>
                                            <span className="modal-hour-time">{hours}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {spaeti.description && (
                        <div className="modal-section">
                            <h3 className="modal-section-title">Description</h3>
                            <p className="modal-section-content">{spaeti.description}</p>
                        </div>
                    )}

                    <div className="modal-section">
                        <h3 className="modal-section-title">Details</h3>
                        <div className="modal-details">
                            <div className="modal-detail-item">
                                <span className="modal-detail-label">Neighborhood</span>
                                <span className="modal-detail-value">{spaeti.neighborhood}</span>
                            </div>
                            <div className="modal-detail-item">
                                <span className="modal-detail-label">Price</span>
                                <span className="modal-detail-value">{spaeti.price}</span>
                            </div>
                            <div className="modal-detail-item">
                                <span className="modal-detail-label">Payment</span>
                                <span className="modal-detail-value">
                                    {spaeti.cardPayment ? 'Card Accepted' : 'Cash Only'}
                                </span>
                            </div>
                            <div className="modal-detail-item">
                                <span className="modal-detail-label">Toilet</span>
                                <span className="modal-detail-value">
                                    {spaeti.hasToilet ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="modal-detail-item">
                                <span className="modal-detail-label">Seating</span>
                                <span className="modal-detail-value">
                                    {spaeti.seating.indoor && spaeti.seating.outdoor 
                                        ? 'Indoor & Outdoor' 
                                        : spaeti.seating.indoor 
                                        ? 'Indoor' 
                                        : 'Outdoor'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
