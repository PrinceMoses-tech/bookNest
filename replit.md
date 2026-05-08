# BookNest

A full-stack MERN e-commerce bookstore application.

## Stack

- **Frontend**: React + Vite (port 5000)
- **Backend**: Express.js + MongoDB/Mongoose (port 3000)
- **Auth**: JWT-based authentication
- **DB**: MongoDB Atlas

## Project Structure

```
/
├── frontend/       # React + Vite app
├── backend/        # Express API server
│   ├── config/     # DB connection
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/    # Seed scripts
│   └── utils/
└── package.json    # Root scripts
```

## Environment Variables / Secrets

- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `PORT` — Backend port (default: 3000)

## Running

- **Frontend**: `npm run dev --prefix frontend` (port 5000)
- **Backend**: `node backend/index.js` (port 3000)
- **Seed books**: `npm run seed`

The Vite dev server proxies `/api/*` requests to the backend at `localhost:3000`.

## User Preferences

- Backend runs on port 3000; frontend on port 5000
