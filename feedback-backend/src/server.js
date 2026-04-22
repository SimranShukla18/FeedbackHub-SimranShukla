import 'dotenv/config'          // Load .env variables FIRST, before any other import
import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000

/**
 * Bootstrap function — connects to MongoDB Atlas, then starts the HTTP server.
 * Wrapping in an async function lets us await the DB connection before accepting traffic.
 */
const bootstrap = async () => {
  // 1. Connect to MongoDB Atlas
  await connectDB()

  // 2. Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(`\n🚀  FeedbackHub API is live`)
    console.log(`   ➜  http://localhost:${PORT}`)
    console.log(`   ➜  Environment: ${process.env.NODE_ENV || 'development'}\n`)
  })

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  // On SIGTERM / SIGINT (Ctrl+C or container stop), close the server cleanly
  // so in-flight requests can complete before the process exits.
  const shutdown = (signal) => {
    console.log(`\n⚡  ${signal} received — shutting down gracefully…`)
    server.close(() => {
      console.log('✅  HTTP server closed.')
      process.exit(0)
    })
    // Force-exit if shutdown takes longer than 10 s
    setTimeout(() => {
      console.error('⏱  Shutdown timeout — forcing exit.')
      process.exit(1)
    }, 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // Catch unhandled promise rejections (e.g. a rogue DB call with no .catch())
  process.on('unhandledRejection', (reason) => {
    console.error('🔴  Unhandled Rejection:', reason)
    shutdown('unhandledRejection')
  })
}

bootstrap()
