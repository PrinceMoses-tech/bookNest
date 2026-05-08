# BookEase Backend API

A RESTful API backend for the BookEase bookstore application built with Node.js, Express, and MongoDB.

## Features

- 📚 **Books Management**: CRUD operations for books
- 🛒 **Order Management**: Create and manage orders
- 👤 **User Management**: User profiles and authentication
- 🗄️ **MongoDB Integration**: Persistent data storage
- 🔒 **Error Handling**: Comprehensive error handling middleware
- 📦 **Stock Management**: Automatic stock updates on orders

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment variables

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── bookController.js   # Book business logic
│   ├── orderController.js # Order business logic
│   └── userController.js  # User business logic
├── models/
│   ├── Book.js            # Book schema
│   ├── Order.js           # Order schema
│   └── User.js            # User schema
├── routes/
│   ├── bookRoutes.js      # Book routes
│   ├── orderRoutes.js     # Order routes
│   └── userRoutes.js      # User routes
├── scripts/
│   └── seedBooks.js       # Database seeding script
└── index.js               # Server entry point
```

## Setup Instructions

### 1. Install Dependencies

Dependencies are installed at the root level. Make sure you've run:
```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookease
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookease?retryWrites=true&w=majority
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
- **Local MongoDB**: Start the MongoDB service
- **MongoDB Atlas**: Use the connection string in your `.env` file

### 4. Seed Database (Optional)

Populate the database with sample books:
```bash
npm run seed
```

### 5. Start the Server

```bash
# Start backend only
npm run backend

# Start both frontend and backend
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Books

- `GET /api/books` - Get all books (supports `?genre=GenreName` query)
- `GET /api/books/:id` - Get single book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/genres/list` - Get all genres

### Orders

- `GET /api/orders` - Get all orders (supports `?userId=userId` query)
- `GET /api/orders/:id` - Get order by MongoDB ID
- `GET /api/orders/orderId/:orderId` - Get order by order ID (e.g., ORD-123)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:email` - Get or create user by email
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user

## Request/Response Examples

### Create Order

**POST** `/api/orders`

```json
{
  "userId": "user123",
  "items": [
    {
      "book": "book_mongodb_id",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "image": "https://...",
      "price": 12.99,
      "quantity": 2,
      "format": "Paperback"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-1234567890-ABC123",
    "userId": "user123",
    "items": [...],
    "total": 25.98,
    "status": "Processing",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Books with Genre Filter

**GET** `/api/books?genre=Fantasy`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "title": "The Hobbit",
      "author": "J.R.R. Tolkien",
      "genre": "Fantasy",
      "price": 14.99,
      ...
    }
  ]
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Notes

- The backend runs on port `5000` by default
- CORS is enabled for all origins (configure for production)
- All routes are currently public (add authentication middleware for production)
- Stock is automatically decremented when orders are created
- Order IDs are auto-generated in format: `ORD-{timestamp}-{random}`

## Production Considerations

1. **Authentication**: Add JWT or session-based auth
2. **Authorization**: Implement role-based access control
3. **Validation**: Add input validation middleware (e.g., express-validator)
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **CORS**: Configure specific origins instead of `*`
6. **Error Logging**: Integrate error logging service
7. **API Documentation**: Add Swagger/OpenAPI documentation
8. **Testing**: Add unit and integration tests

