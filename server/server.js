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

// Connect DB & Services
await connectDB();
await connectCloudinary();

// 1. GLOBAL MIDDLEWARES (No body parsing yet)
app.use(cors());
app.use(clerkMiddleware());

// 2. WEBHOOKS (MUST come before app.use(express.json()))
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// Ensure this is ABOVE app.use(express.json())
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// 3. NOW APPLY JSON PARSING FOR ALL OTHER ROUTES
app.use(express.json());

// 4. ROUTES
app.get('/', (req, res) => res.send('API Working'));

app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// This tells Vercel not to parse the body so Stripe can get the raw Buffer
export const config = {
  api: {
    bodyParser: false,
  },
};