import express from 'express'
import cors from 'cors'
import feedbackRoutes from './routes/feedbackRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import requestLogger from './middleware/requestLogger.js'

const app = express()

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Parse allowed origins from the env variable (comma-separated list)
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl, server-to-server)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS policy: origin "${origin}" is not allowed.`))
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))        // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// ─── Request logger ──────────────────────────────────────────────────────────
app.use(requestLogger)

// ─── Health check ─────────────────────────────────────────────────────────────
/**
 * @route  GET /health
 * @desc   Simple liveness probe — useful for deployment platforms
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FeedbackHub API is running.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/feedback', feedbackRoutes)

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route "${req.method} ${req.originalUrl}" not found.`,
  })
})

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler)

export default app
