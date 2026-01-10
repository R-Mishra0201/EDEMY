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

// Connect DB
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(clerkMiddleware());

// Normal JSON APIs
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('API Working'));
app.use('/api/educator', educatorRouter);
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user',express.json(),userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);



// Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});