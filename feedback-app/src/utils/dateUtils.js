/**
 * Date and filter utility functions.
 */

/**
 * Formats an ISO date string into a human-readable date.
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted date, e.g. "Apr 21, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Formats an ISO date string into date + time.
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted date-time, e.g. "Apr 21, 2026 · 3:45 PM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—'
  const date = new Date(isoString)
  const datePart = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${datePart} · ${timePart}`
}

/**
 * Returns today's date in YYYY-MM-DD format for date inputs.
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Checks whether a date string falls within an inclusive range.
 * @param {string} dateStr - Date to check (ISO string)
 * @param {string} from - Start date (YYYY-MM-DD), optional
 * @param {string} to - End date (YYYY-MM-DD), optional
 * @returns {boolean}
 */
export function isDateInRange(dateStr, from, to) {
  if (!from && !to) return true
  const date = new Date(dateStr)
  // Normalize to start-of-day for consistent comparison
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  if (from) {
    const f = new Date(from)
    if (d < f) return false
  }
  if (to) {
    const t = new Date(to)
    if (d > t) return false
  }
  return true
}

/**
 * Filters feedback entries by keyword (name, email, message) and date range.
 * @param {Array} entries - Array of feedback objects
 * @param {Object} filters - { keyword, dateFrom, dateTo }
 * @returns {Array} Filtered entries
 */
export function applyFilters(entries, { keyword = '', dateFrom = '', dateTo = '' }) {
  return entries.filter((entry) => {
    // Keyword filter — case insensitive, searches name + email + message
    if (keyword.trim()) {
      const kw = keyword.toLowerCase()
      const inName = entry.name.toLowerCase().includes(kw)
      const inEmail = entry.email.toLowerCase().includes(kw)
      const inMessage = entry.message.toLowerCase().includes(kw)
      if (!inName && !inEmail && !inMessage) return false
    }

    // Date range filter
    const dateField = entry.createdAt || entry.date
    if (!isDateInRange(dateField, dateFrom, dateTo)) return false

    return true
  })
}
