import { Router } from 'express'
import {
  getAllFeedback,
  createFeedback,
  deleteFeedback,
  getFeedbackById,
} from '../controllers/feedbackController.js'
import {
  feedbackValidationRules,
  handleValidationErrors,
} from '../middleware/validateFeedback.js'

const router = Router()

/**
 * @route   GET /feedback
 * @desc    Get all feedback entries (supports ?keyword, ?dateFrom, ?dateTo)
 * @access  Public
 */
router.get('/', getAllFeedback)

/**
 * @route   POST /feedback
 * @desc    Submit a new feedback entry
 * @access  Public
 */
router.post(
  '/',
  feedbackValidationRules,      // 1. Validate + sanitise input
  handleValidationErrors,        // 2. Return 422 if any rule failed
  createFeedback                 // 3. Persist to MongoDB
)

/**
 * @route   GET /feedback/:id
 * @desc    Get a single feedback entry by ID
 * @access  Public
 */
router.get('/:id', getFeedbackById)

/**
 * @route   DELETE /feedback/:id
 * @desc    Delete a feedback entry by ID
 * @access  Public
 */
router.delete('/:id', deleteFeedback)

export default router
