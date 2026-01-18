import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// ✅ Connection caching for Vercel serverless
let isConnected = false;

const initializeConnections = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      await connectCloudinary();
      isConnected = true;
      console.log('🚀 All connections initialized');
    } catch (error) {
      console.error('❌ Connection initialization failed:', error);
      // Don't throw in serverless - let it retry on next request
    }
  }
};

// Initialize connections
await initializeConnections();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Set your frontend URL in env
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Clerk middleware
app.use(clerkMiddleware());

// Webhooks (must be BEFORE express.json())
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// JSON parser for regular routes
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.url} not found` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Local server (only runs locally, not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// ✅ CRITICAL: Default export for Vercel
export default app;