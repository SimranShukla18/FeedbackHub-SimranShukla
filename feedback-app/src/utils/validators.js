/**
 * Form validation utilities for the feedback form.
 */

/**
 * Validates an email address format.
 * @param {string} email - Email string to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(String(email).toLowerCase())
}

/**
 * Validates that a string is non-empty after trimming.
 * @param {string} value - String to check
 * @returns {boolean} True if non-empty
 */
export function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Validates the entire feedback form and returns an errors object.
 * @param {Object} formData - { name, email, message }
 * @returns {Object} errors object; empty object means valid
 */
export function validateFeedbackForm({ name, email, message }) {
  const errors = {}

  if (!isNonEmpty(name)) {
    errors.name = 'Name is required.'
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  if (!isNonEmpty(email)) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!isNonEmpty(message)) {
    errors.message = 'Message is required.'
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  }

  return errors
}
