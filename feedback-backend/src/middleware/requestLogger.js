/**
 * Simple request logger middleware.
 * Logs method, URL, status code, and response time for every request.
 * In production you'd replace this with a proper library like morgan or pino.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const requestLogger = (req, res, next) => {
  const start = Date.now()

  // Hook into the 'finish' event so we can log status AFTER the response is sent
  res.on('finish', () => {
    const duration = Date.now() - start
    const statusColor =
      res.statusCode >= 500 ? '\x1b[31m' // red
      : res.statusCode >= 400 ? '\x1b[33m' // yellow
      : res.statusCode >= 300 ? '\x1b[36m' // cyan
      : '\x1b[32m'                          // green
    const reset = '\x1b[0m'

    console.log(
      `${statusColor}${res.statusCode}${reset} ${req.method} ${req.originalUrl} — ${duration}ms`
    )
  })

  next()
}

export default requestLogger
