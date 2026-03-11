# EDEMY

A full-stack Learning Management System (LMS) built with a **React + Vite** frontend and an **Express + MongoDB** backend. The project supports student course discovery and enrollment, educator course management, progress tracking, Clerk-based authentication, Cloudinary media uploads, and Stripe-powered checkout.

## Repository Structure

```text
EDEMY/
├─ client/   # React (Vite) frontend
└─ server/   # Express API + MongoDB models/controllers
```

## Core Features

### Student experience
- Browse all published courses.
- View full course detail pages.
- Purchase courses through Stripe Checkout.
- Track lecture progress and resume learning.
- Rate purchased courses.
- View enrolled courses.

### Educator experience
- Upgrade account role to educator.
- Create and publish courses (with thumbnail upload).
- View own courses.
- Access dashboard stats (course count, earnings, enrolled students).
- View student enrollment data.

### Platform integrations
- **Clerk** for authentication and user lifecycle webhooks.
- **Stripe** for checkout session creation and webhook-based payment completion.
- **Cloudinary** for media storage (course thumbnails).
- **MongoDB + Mongoose** for persistent data models.

## Tech Stack

### Frontend (`client`)
- React 19
- Vite 7
- React Router
- Clerk React SDK
- Axios
- Tailwind CSS
- React Toastify
- Quill editor

### Backend (`server`)
- Node.js + Express 5
- Clerk Express middleware
- MongoDB + Mongoose
- Stripe SDK
- Svix (for Clerk webhook verification)
- Multer + Cloudinary
- CORS + dotenv

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB database
- Clerk application (publishable key + webhook secret)
- Stripe account (secret + webhook secret)
- Cloudinary account credentials

## Environment Variables

Create environment files for both applications.

### `server/.env`

```bash
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_connection_string_without_trailing_db_name

# Auth (Clerk)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret

# Payments (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CURRENCY=USD

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
```

### `client/.env`

```bash
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Getting Started

### 1) Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2) Run backend

```bash
cd server
npm run server
```

Server runs on `http://localhost:5000` by default.

### 3) Run frontend

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Available Scripts

### Frontend (`client/package.json`)
- `npm run dev` – start local Vite dev server.
- `npm run build` – production build.
- `npm run preview` – preview production build locally.
- `npm run lint` – run ESLint.

### Backend (`server/package.json`)
- `npm run server` – run API with nodemon.
- `npm start` – run API with node.

## API Overview

Base URL (local): `http://localhost:5000`

### Public routes
- `GET /` – health check.
- `GET /api/course/all` – list all published courses.
- `GET /api/course/:id` – fetch full course details by ID.

### User routes
- `GET /api/user/data` – authenticated user profile.
- `GET /api/user/enrolled-courses` – user’s enrolled courses.
- `POST /api/user/purchase` – create Stripe checkout session.
- `POST /api/user/update-course-progress` – mark lecture progress.
- `POST /api/user/get-course-progress` – fetch progress for a course.
- `POST /api/user/add-rating` – submit/update course rating.

### Educator routes (auth required)
- `POST /api/educator/update-role` – make user educator.
- `POST /api/educator/add-course` – add course (multipart with `image`).
- `GET /api/educator/courses` – list educator courses.
- `GET /api/educator/dashboard-data` – educator summary metrics.
- `GET /api/educator/enrolled-students` – enrolled student data.

### Webhooks
- `POST /clerk` – Clerk user events.
- `POST /stripe` – Stripe payment events.

## Deployment Notes

- Both `client` and `server` include `vercel.json` files.
- Backend exports the Express app for serverless runtime compatibility.
- Set all environment variables in your hosting platform (Vercel project settings).
- Ensure Stripe webhook points to your deployed `/stripe` endpoint.
- Ensure Clerk webhook points to your deployed `/clerk` endpoint.

## Common Troubleshooting

- **401/403 authentication issues**: verify Clerk keys in both apps and ensure auth headers are sent.
- **CORS errors**: set `FRONTEND_URL` to your frontend origin.
- **Stripe checkout works but enrollment not updated**: verify Stripe webhook secret and endpoint delivery status.
- **Image upload failures**: validate Cloudinary credentials.
- **Database connection failures**: verify `MONGODB_URI` and network access from deployment target.

## Future Improvements (Suggested)

- Add automated unit/integration tests for API controllers.
- Add schema validation middleware for request bodies.
- Add role/permission guards for user routes consistently.
- Add CI pipeline for lint + build checks on pull requests.
- Replace manual API docs with OpenAPI/Swagger spec.

## License

This project currently has no explicit open-source license in the repository. Add a `LICENSE` file if you want to define usage and distribution terms.
