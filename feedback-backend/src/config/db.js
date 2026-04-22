import mongoose from 'mongoose'

/**
 * Establishes a connection to MongoDB Atlas using the URI from environment variables.
 * Exits the process on failure so misconfiguration is caught at startup.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI

    if (!uri) {
      throw new Error(
        'MONGO_URI is not defined in environment variables.\n' +
        'Copy .env.example to .env and fill in your MongoDB Atlas connection string.'
      )
    }

    const conn = await mongoose.connect(uri, {
      // These options are recommended for Atlas connections
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,
    })

    console.log(`✅  MongoDB Atlas connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`)
    process.exit(1) // Crash early — don't run without a database
  }
}

export default connectDB
