/**
 * Global error-handling middleware.
 * Must be registered LAST in Express (after all routes).
 *
 * Catches any error passed via next(error) or thrown inside async routes
 * (when using the asyncHandler wrapper).
 *
 * @param {Error}                          err
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next  — required 4-arg signature for Express to treat this as an error handler
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log full stack in development, short message in production
  if (process.env.NODE_ENV !== 'production') {
    console.error('🔴 Unhandled error:', err.stack || err.message)
  } else {
    console.error('🔴 Unhandled error:', err.message)
  }

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

/**
 * Wraps an async Express route handler to forward thrown errors to next().
 * Avoids repetitive try/catch inside every controller.
 *
 * Usage:
 *   router.get('/route', asyncHandler(async (req, res) => { ... }))
 *
 * @param {Function} fn - Async route handler
 * @returns {Function}  Express middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default errorHandler
