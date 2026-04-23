# HemoLink Frontend

Frontend application for HemoLink - a blood donor and recipient connection platform.

## Tech Stack

- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Hot Toast** - Toast notifications

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BloodRequestCard.jsx
│   │   ├── ChatMessage.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useSocket.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── BloodRequests.jsx
│   │   ├── CreateRequest.jsx
│   │   └── Chat.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── bloodRequestService.js
│   │   └── messageService.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
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
   - `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)
   - `REACT_APP_SOCKET_URL` - Socket.IO server URL (default: http://localhost:5000)

## Running the Application

### Development Mode
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Production Build
```bash
npm run build
```

The optimized build will be created in the `build/` directory.

## Pages

### Home (`/`)
- Landing page with hero section
- Features overview
- Statistics
- Call-to-action

### Login (`/login`)
- User authentication form
- Redirects to dashboard on success

### Register (`/register`)
- User registration form
- Collects personal info, blood group, and location

### Dashboard (`/dashboard`)
- User statistics (active requests, fulfilled requests, unread messages)
- Quick action buttons
- Recent requests
- Recent conversations

### Blood Requests (`/requests`)
- List of all blood requests
- Filter by blood group, urgency, and city
- Card-based layout with request details
- Express interest functionality

### Create Request (`/create-request`)
- Form to create new blood donation request
- Patient and hospital information
- Location details
- Urgency level selection

### Chat (`/chat`)
- Real-time chat interface
- Conversation list sidebar
- Message history
- Typing indicators
- Read receipts

## Components

### Navbar
- Main navigation bar
- Authentication status display
- Responsive design

### BloodRequestCard
- Displays blood request information
- Urgency and status badges
- Action buttons (View Details, I Can Help)

### ChatMessage
- Individual message display
- Different styling for sent/received messages
- Timestamp display

### LoadingSpinner
- Loading indicator for async operations
- Configurable sizes

## Custom Hooks

### useAuth
- Manages authentication state
- Provides login, logout, register methods
- Token management in localStorage

### useSocket
- Manages Socket.IO connection
- Real-time message handling
- Typing indicators
- Room management for requests

## Services

### api.js
- Axios instance configuration
- Request/response interceptors
- Token injection
- Error handling

### authService.js
- User registration
- User login
- Profile management

### bloodRequestService.js
- CRUD operations for blood requests
- Filtering and search
- Nearby requests (geospatial)

### messageService.js
- Send messages
- Get conversations
- Mark as read
- Unread count

## Features

- Responsive design (mobile-first)
- Real-time chat with Socket.IO
- Protected routes with authentication
- Toast notifications
- Loading states
- Error handling
- Form validation
- Blood group filtering
- Urgency-based sorting
- Geolocation support (for nearby requests)

## Styling

- Tailwind CSS for utility-first styling
- Custom color palette (primary red theme)
- Mobile-responsive layouts
- Smooth transitions and hover effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
