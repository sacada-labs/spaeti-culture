import React from 'react'

export const Loading = ({ isLoading }) => {
    if (!isLoading) return null

    return (
        <div className="loading">
            <div className="spinner"></div>
            <p>Loading map...</p>
        </div>
    )
}
