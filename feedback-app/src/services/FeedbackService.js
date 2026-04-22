/**
 * FeedbackService — handles all API communication with the backend.
 * Base URL reads from the Vite env variable; falls back to localhost:5000.
 *
 * Backend response envelope shape:
 *   { success: boolean, message?: string, data?: any, count?: number }
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Generic fetch wrapper with error handling.
 * Unwraps the `data` field from the standard API response envelope.
 *
 * @param {string}      endpoint - API endpoint path (e.g. '/feedback')
 * @param {RequestInit} options  - Fetch options
 * @returns {Promise<any>}       Unwrapped value — `body.data` when present, else full body, else null
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }

  const response = await fetch(url, config)

  // 204 No Content (e.g. DELETE success) — nothing to parse
  if (response.status === 204) return null

  // Parse JSON body for all other responses
  let body = null
  try {
    body = await response.json()
  } catch {
    // Non-JSON body — treat as empty
  }

  // Handle HTTP errors: surface the backend's message if available
  if (!response.ok) {
    const message =
      body?.message ||
      (Array.isArray(body?.details)
        ? body.details.map((e) => e.message).join(', ')
        : null) ||
      `HTTP ${response.status}: ${response.statusText}`
    throw new Error(message)
  }

  // ── Unwrap the response envelope ──────────────────────────────────────────
  // Backend sends: { success: true, count: N, data: [...] }  (GET /feedback)
  //            or: { success: true, data: {...} }             (POST /feedback)
  // We always want just the `data` field; fall back to full body if absent.
  if (body !== null && typeof body === 'object' && 'data' in body) {
    return body.data
  }

  return body
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