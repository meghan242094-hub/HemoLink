# HemoLink

A blood donor and recipient connection platform that helps save lives by connecting people who need blood with willing donors in their area.

## Overview

HemoLink is a full-stack web application that enables:
- Blood donors to register and find nearby blood donation requests
- Recipients to create blood requests and connect with donors
- Real-time communication between donors and recipients
- Location-based search for nearby requests

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Hot Toast** - Toast notifications

## Project Structure

```
HemoLink/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── .env.example     # Environment variables template
│   ├── package.json     # Backend dependencies
│   ├── server.js        # Server entry point
│   └── README.md        # Backend documentation
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app component
│   │   └── index.js     # Entry point
│   ├── .env.example     # Environment variables template
│   ├── package.json     # Frontend dependencies
│   ├── tailwind.config.js
│   └── README.md        # Frontend documentation
└── README.md            # This file
```

## Features

### User Authentication
- User registration with blood group and location
- Secure login with JWT tokens
- Profile management

### Blood Requests
- Create blood donation requests
- View all blood requests with filters
- Find nearby requests based on location
- Express interest in requests
- Track request status (active, fulfilled, cancelled)

### Real-time Chat
- Direct messaging between donors and recipients
- Typing indicators
- Read receipts
- Conversation management

### Mobile Responsive
- Fully responsive design
- Mobile-first approach
- Touch-friendly interface

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HemoLink
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Environment Setup

#### Backend
1. Copy `backend/.env.example` to `backend/.env`
2. Update the following variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure secret key for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Frontend URL for CORS

#### Frontend
1. Copy `frontend/.env.example` to `frontend/.env`
2. Update the following variables:
   - `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)
   - `REACT_APP_SOCKET_URL` - Socket.IO server URL (default: http://localhost:5000)

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Documentation

For detailed API documentation, see [backend/README.md](backend/README.md)

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Blood Requests
- `POST /api/blood-requests` - Create a blood request
- `GET /api/blood-requests` - Get all blood requests
- `GET /api/blood-requests/nearby` - Get nearby requests
- `POST /api/blood-requests/:id/interest` - Express interest

#### Messages
- `POST /api/messages` - Send a message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId/:bloodRequestId` - Get conversation

## Usage

### For Donors
1. Register with your blood group and location
2. Browse blood requests near you
3. Filter by blood group and urgency
4. Express interest in requests
5. Chat with recipients to coordinate donation

### For Recipients
1. Register your account
2. Create a blood request with patient details
3. Specify urgency level and location
4. Connect with interested donors
5. Coordinate donation through chat

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.

## Acknowledgments

- Built to help save lives through blood donation
- Inspired by the need for efficient blood donation coordination