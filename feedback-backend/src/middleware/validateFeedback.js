import { body, validationResult } from 'express-validator'

/**
 * Validation rules for POST /feedback.
 * These run before the controller and reject malformed input early.
 */
export const feedbackValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters.')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.')
    .escape(), // Sanitise HTML entities

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(), // Lowercases and normalises

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters.')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters.'),
]

/**
 * Middleware that checks the result of validation rules above.
 * If any rule failed, responds 422 with structured error details.
 * Otherwise calls next() to proceed to the controller.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }))
    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check the submitted fields.',
      details,
    })
  }

  next()
}
