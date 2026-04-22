# FeedbackHub — Backend API

RESTful API built with **Node.js + Express + MongoDB Atlas** for the FeedbackHub frontend.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js >= 18                     |
| Framework    | Express 4                         |
| Database     | MongoDB Atlas via Mongoose 8      |
| Validation   | express-validator 7               |
| Environment  | dotenv                            |
| Dev server   | nodemon                           |

---

## Project Structure

```
src/
├── config/
│   └── db.js                  # MongoDB Atlas connection
├── controllers/
│   └── feedbackController.js  # getAllFeedback, createFeedback, deleteFeedback, getFeedbackById
├── middleware/
│   ├── validateFeedback.js    # express-validator rules + error responder
│   ├── errorHandler.js        # Global error handler + asyncHandler util
│   └── requestLogger.js       # Coloured request/response logger
├── models/
│   └── Feedback.js            # Mongoose schema and model
├── routes/
│   └── feedbackRoutes.js      # Route definitions
├── app.js                     # Express app config (CORS, middleware, routes)
└── server.js                  # Entry point: DB connect then server start
```

---

## Setup

### 1. Get a MongoDB Atlas connection string

1. Go to https://cloud.mongodb.com and sign in (free account works).
2. Create a free M0 cluster.
3. Under Database Access, create a database user with read/write permissions.
4. Under Network Access, add 0.0.0.0/0 (allow from anywhere).
5. Click Connect > Connect your application and copy the connection string:
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/feedbackhub?retryWrites=true&w=majority

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your .env:

```
MONGO_URI=mongodb+srv://john:pass123@cluster0.xxxxx.mongodb.net/feedbackhub?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Install and run

```bash
npm install

# Development (auto-restarts on change)
npm run dev

# Production
npm start
```

Server starts at http://localhost:5000

---

## API Reference

### GET /health
Liveness check.

### GET /feedback
Returns all entries sorted newest-first.
Query params: keyword, dateFrom (YYYY-MM-DD), dateTo (YYYY-MM-DD)

### POST /feedback
Body: { name, email, message }
Returns 201 with created entry, or 422 with validation details.

### GET /feedback/:id
Returns a single entry by MongoDB ObjectId.

### DELETE /feedback/:id
Deletes entry. Returns 204 No Content on success.

---

## Validation Rules

| Field   | Rules                                   |
|---------|-----------------------------------------|
| name    | Required, min 2 chars, max 100 chars    |
| email   | Required, valid email format            |
| message | Required, min 10 chars, max 2000 chars  |

Validated at two layers: express-validator middleware AND Mongoose schema.

---

## Connecting with the Frontend

In the frontend .env file:
```
VITE_API_URL=http://localhost:5000
```
