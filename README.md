📚 BookNest – Full Stack MERN Book Store Application
📝 Project Overview

BookNest is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
The application allows users to browse books, create accounts, log in securely, add books to cart, place orders, and manage their profiles.

It includes authentication, authorization, protected routes, and a responsive modern UI.

🚀 Live Demo

Frontend: https://your-frontend-url.vercel.app
Backend API: https://your-backend-url.onrender.com

🛠️ Tech Stack
Frontend
React.js (Vite)
React Router DOM
Context API
Axios
CSS / Modern UI Design

Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT Authentication
bcryptjs

Deployment
Frontend: Vercel / Render
Backend: Render
Database: MongoDB Atlas


User Registration
User Login
Password hashing using bcrypt
JWT-based authentication
Role-based authorization (User / Admin)
Protected routes
Persistent login using localStorage

📚 Book Management

Browse books
View book details
Filter by genre
Responsive grid layout

🛒 Cart System
Add to cart
Update quantity
Remove items
Calculate total price
Persist cart in localStorage

📦 Orders
Place order
Order confirmation
View order history
Order status tracking

👤 User Profile
View and update profile
View previous orders

🔐 Authentication Flow
User registers → Password is hashed.
JWT token is generated.
Token stored in localStorage.
Protected routes verify token using middleware.

Admin routes check user role.

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/booknest.git
cd booknest
2️⃣ Backend Setup
cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start backend:

npm start
3️⃣ Frontend Setup
cd frontend
npm install

Create .env file:
VITE_API_URL=http://localhost:5000/api

Run frontend:

npm run dev
🌍 Deployment Steps
Backend (Render)

Root directory: backend

Build command: npm install

Start command: npm start

Add environment variables

Frontend (Vercel / Render)

Root directory: frontend

Build command: npm install && npm run build

Publish directory: dist
Add environment variable: VITE_API_URL
