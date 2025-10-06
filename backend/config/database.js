const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Wait up to 10s for server selection to succeed
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    // Rethrow so callers can decide to exit the process or handle the error.
    throw error;
  }
};

module.exports = connectDB;