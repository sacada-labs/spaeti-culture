import React from 'react'

export const LocationButton = ({ onClick, isLoading, hasLocation, error }) => {
    if (hasLocation) {
        return null // Don't show button if location is already available
    }

    const getButtonText = () => {
        if (isLoading) return 'Locating...'
        if (error) return 'Enable Location'
        return 'Find Near Me'
    }

    const getIcon = () => {
        if (isLoading) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite" />
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite" />
                    </circle>
                </svg>
            )
        }
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
        )
    }

    return (
        <button
            className="location-button"
            onClick={onClick}
            disabled={isLoading}
            aria-label="Get your location"
        >
            {getIcon()}
            <span>{getButtonText()}</span>
        </button>
    )
}
