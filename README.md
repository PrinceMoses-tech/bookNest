# 📚 BookNest – Full Stack MERN Book Store Application

> A production-ready full-stack e-commerce web application built using the MERN stack.

---

## 🚀 Live Demo

🌐 Frontend: `https://book-nest-black.vercel.app/`
🔗 Backend API: `https://booknest-czhb.onrender.com/`

---

## 📌 Overview

**BookNest** is a full-stack web application that allows users to:

* Browse books
* Register and login securely
* Add books to cart
* Place orders
* View order history
* Manage profile information

The application follows clean architecture principles and includes secure authentication and role-based authorization.

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* React Router DOM
* Context API
* Axios
* Modern Responsive UI

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## ✨ Features

### 🔐 Authentication & Authorization

* User Registration
* Secure Login
* Password hashing (bcrypt)
* JWT-based authentication
* Protected routes
* Role-based access (User/Admin)

### 📚 Book Management

* Browse books
* View detailed book information
* Filter by category

### 🛒 Cart System

* Add to cart
* Update quantity
* Remove items
* Calculate total price

### 📦 Orders

* Place order
* Order confirmation
* View order history

### 👤 Profile

* View and update user details
* View previous orders

---

## 🔐 Authentication Flow

1. User registers → Password is hashed.
2. User logs in → JWT token generated.
3. Token stored in localStorage.
4. Protected routes validate token.
5. Admin routes check role permissions.

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/PrinceMoses-tech/bookNest.git
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run backend
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run frontend
```

---

## 🔎 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/profile`

### Books

* `GET /api/books`
* `GET /api/books/:id`

### Orders

* `POST /api/orders`
* `GET /api/orders`

---

## 🌍 Deployment

### Backend (Render)

* Root directory: `backend`
* Build command: `npm install`
* Start command: `npm start`

### Frontend (Vercel / Render)

* Root directory: `frontend`
* Build command: `npm install && npm run build`
* Publish directory: `dist`

---

## 🎯 Learning Outcomes

* Full-stack MERN development
* JWT authentication & authorization
* REST API integration
* State management using Context API
* Deployment of production-ready apps
* Environment configuration handling

---

## 🔮 Future Enhancements

* Payment gateway integration
* Admin dashboard
* Search & pagination
* Email verification
* Password reset system
* Image upload support

---

## 👨‍💻 Author

**Moses K**
B.Tech CSE-AIML
Full Stack MERN Developer

---

## 📌 License

This project is developed for internship and learning purposes.
