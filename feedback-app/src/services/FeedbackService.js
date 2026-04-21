/**
 * FeedbackService — handles all API communication with the backend.
 * Base URL reads from the Vite env variable; falls back to localhost:5000.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    // Try to parse backend error message
    let errorMsg = `HTTP ${response.status}: ${response.statusText}`
    try {
      const errData = await response.json()
      errorMsg = errData.message || errorMsg
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(errorMsg)
  }

  // 204 No Content — return null
  if (response.status === 204) return null

  return response.json()
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch all feedback entries from the backend.
 * @returns {Promise<Array>} Array of feedback objects
 */
export async function getAllFeedback() {
  return apiFetch('/feedback')
}

/**
 * Submit a new feedback entry.
 * @param {Object} feedbackData - { name, email, message }
 * @returns {Promise<Object>} Created feedback object
 */
export async function submitFeedback(feedbackData) {
  return apiFetch('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  })
}

/**
 * Delete a feedback entry by ID.
 * @param {string} id - Feedback entry ID
 * @returns {Promise<null>}
 */
export async function deleteFeedback(id) {
  return apiFetch(`/feedback/${id}`, { method: 'DELETE' })
}

const FeedbackService = { getAllFeedback, submitFeedback, deleteFeedback }
export default FeedbackService
