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

// Connect DB & Services (Top-level await Vercel Node 20+ mein chalta hai)
await connectDB();
await connectCloudinary();

app.use(cors());
app.use(clerkMiddleware());

// 1. WEBHOOKS (Yahan express.raw() hi rehne dein)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// 2. JSON PARSING (Sirf baki routes ke liye)
app.use(express.json());

// 3. ROUTES
app.get('/', (req, res) => res.send('API Working'));
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Vercel ke liye export default app zaruri hai
export default app;