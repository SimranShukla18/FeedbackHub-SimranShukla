import Feedback from '../models/Feedback.js'

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Sends a standardised JSON error response.
 *
 * @param {import('express').Response} res
 * @param {number}  statusCode
 * @param {string}  message
 * @param {any}     [details]  - Optional extra info (validation errors, etc.)
 */
const sendError = (res, statusCode, message, details = null) => {
  const body = { success: false, message }
  if (details) body.details = details
  return res.status(statusCode).json(body)
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /feedback
 *
 * Returns all feedback entries sorted newest-first.
 * Supports optional query-param filtering:
 *   ?keyword   — case-insensitive search across name, email, message
 *   ?dateFrom  — ISO date string, inclusive lower bound on createdAt
 *   ?dateTo    — ISO date string, inclusive upper bound on createdAt
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
export const getAllFeedback = async (req, res) => {
  try {
    const { keyword, dateFrom, dateTo } = req.query
    const query = {}

    // ── Keyword filter ──────────────────────────────────────────────────────
    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), 'i') // case-insensitive
      query.$or = [{ name: regex }, { email: regex }, { message: regex }]
    }

    // ── Date range filter ───────────────────────────────────────────────────
    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) {
        // Start of day — inclusive
        const from = new Date(dateFrom)
        from.setUTCHours(0, 0, 0, 0)
        query.createdAt.$gte = from
      }
      if (dateTo) {
        // End of day — inclusive
        const to = new Date(dateTo)
        to.setUTCHours(23, 59, 59, 999)
        query.createdAt.$lte = to
      }
    }

    const entries = await Feedback.find(query).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    })
  } catch (error) {
    console.error('[getAllFeedback]', error)
    return sendError(res, 500, 'Server error while fetching feedback.')
  }
}

/**
 * POST /feedback
 *
 * Creates a new feedback entry.
 * Body: { name, email, message }
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
export const createFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body

    const feedback = await Feedback.create({ name, email, message })

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      data: feedback,
    })
  } catch (error) {
    // Mongoose validation errors (schema-level)
    if (error.name === 'ValidationError') {
      const details = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }))
      return sendError(res, 422, 'Validation failed.', details)
    }
    console.error('[createFeedback]', error)
    return sendError(res, 500, 'Server error while saving feedback.')
  }
}

/**
 * DELETE /feedback/:id
 *
 * Deletes a feedback entry by MongoDB ObjectId.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params

    const feedback = await Feedback.findByIdAndDelete(id)

    if (!feedback) {
      return sendError(res, 404, `No feedback found with id "${id}".`)
    }

    // 204 No Content — deletion confirmed, nothing to return
    return res.status(204).send()
  } catch (error) {
    // CastError means the id string is not a valid ObjectId
    if (error.name === 'CastError') {
      return sendError(res, 400, `"${req.params.id}" is not a valid feedback ID.`)
    }
    console.error('[deleteFeedback]', error)
    return sendError(res, 500, 'Server error while deleting feedback.')
  }
}

/**
 * GET /feedback/:id
 *
 * Fetches a single feedback entry by ID.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params
    const feedback = await Feedback.findById(id)

    if (!feedback) {
      return sendError(res, 404, `No feedback found with id "${id}".`)
    }

    return res.status(200).json({ success: true, data: feedback })
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, `"${req.params.id}" is not a valid feedback ID.`)
    }
    console.error('[getFeedbackById]', error)
    return sendError(res, 500, 'Server error while fetching feedback.')
  }
}
