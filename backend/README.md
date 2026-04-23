# HemoLink Backend

Backend API for HemoLink - a blood donor and recipient connection platform.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
backend/
├── config/
├── controllers/
│   ├── authController.js
│   ├── bloodRequestController.js
│   └── messageController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validateRequest.js
├── models/
│   ├── User.js
│   ├── BloodRequest.js
│   └── Message.js
├── routes/
│   ├── auth.js
│   ├── bloodRequests.js
│   └── messages.js
├── services/
│   ├── authService.js
│   ├── bloodRequestService.js
│   └── messageService.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the following variables in `.env`:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure secret key for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in `.env` (default: 5000).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Blood Requests

- `POST /api/blood-requests` - Create a blood request (protected)
- `GET /api/blood-requests` - Get all blood requests (with filters)
- `GET /api/blood-requests/nearby` - Get nearby blood requests
- `GET /api/blood-requests/my-requests` - Get user's blood requests (protected)
- `GET /api/blood-requests/:id` - Get blood request by ID
- `POST /api/blood-requests/:id/interest` - Express interest (protected)
- `PUT /api/blood-requests/:id/status` - Update request status (protected)
- `DELETE /api/blood-requests/:id` - Delete request (protected)

### Messages

- `POST /api/messages` - Send a message (protected)
- `GET /api/messages/conversations` - Get user conversations (protected)
- `GET /api/messages/unread-count` - Get unread message count (protected)
- `GET /api/messages/:userId/:bloodRequestId` - Get conversation (protected)
- `PUT /api/messages/mark-read` - Mark messages as read (protected)

## Socket.IO Events

### Client → Server

- `join_request` - Join a blood request room
- `leave_request` - Leave a blood request room
- `send_message` - Send a message
- `typing` - Emit typing indicator
- `stop_typing` - Stop typing indicator
- `interest_expressed` - Notify interest expressed
- `request_status_changed` - Notify status change

### Server → Client

- `receive_message` - Receive a new message
- `message_sent` - Confirmation of message sent
- `user_typing` - User is typing
- `user_stop_typing` - User stopped typing
- `new_interest` - New interest notification
- `status_update` - Request status update

## Database Models

### User
- name, email, password, phone
- bloodGroup
- location (coordinates, address, city, state)
- isDonor, lastDonationDate

### BloodRequest
- recipient (reference to User)
- bloodGroup, unitsNeeded, urgency
- hospitalName, location
- patientName, patientAge
- contactPerson, contactPhone
- additionalNotes, status
- interestedDonors, fulfilledBy

### Message
- sender, recipient (references to User)
- bloodRequest (reference to BloodRequest)
- content, isRead, readAt

## Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Error handling middleware
- Geospatial queries for nearby requests
- Real-time chat with Socket.IO
- CORS configuration
- MongoDB connection with retry logic

## License

ISC
