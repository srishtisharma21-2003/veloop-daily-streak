# VELoop Rewards — Daily Streak & Rewards System

A full-stack MERN application where authenticated users can log in daily, maintain a 7-day consecutive streak, and unlock increasingly valuable rewards.

## Core Principle

The backend is the single source of truth. The frontend never decides streak, day, reward, timer, wallet balance, or claim eligibility. All values are derived from the Express server and MongoDB data.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Bootstrap, CSS Modules, Lucide React
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- Security: Helmet, express-rate-limit, express-validator, MongoDB transactions
- Deployment: Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Features

- JWT authentication
- Backend-driven streak state
- 7-day reward cycle with a final reward tier
- 24-hour claim countdown synced to server time
- Polished daily reward UI with CPA demo overlay
- Wallet and transaction ledger integration
- Duplicate claim prevention and reset logic
- Responsive dashboard UI

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev -- --host 0.0.0.0
```

## Environment Variables

Backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/veloop-streak
JWT_SECRET=change_this_to_a_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/daily-streak | Get streak status |
| POST | /api/daily-streak/claim | Claim current day reward |
| GET | /api/daily-streak/history | Reward history |
| GET | /api/wallet | Wallet balance |

## Streak Logic

- 7-day cycle of progressive rewards
- One claim per day, following day order
- 24-hour wait for the next reward
- Missed-day reset logic after the allowed gap
- Reward and wallet data are always read from the database

## Security

- JWT-protected API routes
- Client-controlled values are ignored by the backend
- Unique index prevents duplicate claims
- MongoDB transactions protect concurrent reward attempts
- Rate limiting and audit logging are enabled

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Author

Srishti Sharma — VELoop Rewards Internship Project
