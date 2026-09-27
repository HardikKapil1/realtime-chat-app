const mongoose = require('mongoose');

/**
 * Connect to MongoDB database using Mongoose.
 * Implements graceful connection handling and logging.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
  }
};

// Handle connection events gracefully
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Warning: Disconnected from database.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime connection error: ${err.message}`);
});

module.exports = connectDB;
