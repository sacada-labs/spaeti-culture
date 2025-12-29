/**
 * Check if a Spaeti is currently open based on opening hours
 * @param {Object} openingHours - Object with days as keys and time ranges as values (e.g., "08:00 - 02:00")
 * @returns {boolean} - True if the Spaeti is currently open
 */
export const isSpaetiOpen = (openingHours) => {
    if (!openingHours) return false

    const now = new Date()
    const currentDay = getCurrentDay(now)
    const currentTime = now.getHours() * 100 + now.getMinutes() // Convert to HHMM format (e.g., 1430 for 14:30)

    const hours = openingHours[currentDay]
    if (!hours) return false

    // Handle time ranges like "08:00 - 02:00" (overnight)
    const [openTime, closeTime] = hours.split(' - ').map(time => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 100 + minutes
    })

    // If close time is less than open time, it means it closes the next day (overnight)
    if (closeTime < openTime) {
        // Open if current time is >= open time OR current time is < close time
        return currentTime >= openTime || currentTime < closeTime
    } else {
        // Normal hours (same day)
        return currentTime >= openTime && currentTime < closeTime
    }
}

/**
 * Get the current day name in lowercase (monday, tuesday, etc.)
 */
const getCurrentDay = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()]
}
