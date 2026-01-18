import mongoose from "mongoose";

// ✅ Connection options optimized for Vercel serverless
const connectDB = async () => {
  try {
    // Event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Connect with optimized settings for serverless
    await mongoose.connect(`${process.env.MONGODB_URI}/lms`, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      maxPoolSize: 10, // Maximum connection pool size
      minPoolSize: 1, // Minimum connection pool size
    });

    console.log('MongoDB connection initiated');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    // Don't exit process in serverless environment
    // process.exit(1); // Remove this for Vercel
    throw error;
  }
};

export default connectDB;