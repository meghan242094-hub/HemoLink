# Docker Deployment Guide for HemoLink

This guide covers deploying HemoLink using Docker with both frontend and backend in a single container.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed (optional but recommended)
- MongoDB Atlas account (or local MongoDB)

## Files Created

- `Dockerfile` - Multi-stage build for frontend + backend
- `docker-compose.yml` - Orchestration configuration
- `.dockerignore` - Files to exclude from Docker build

## Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 2. MongoDB Atlas Setup (Required)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster (free tier works)
3. Create a database user
4. **Important**: Add `0.0.0.0/0` to Network Access (IP Whitelist) to allow Docker container connections
5. Get your connection string

## Deployment Steps

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the container
docker-compose down
```

### Option 2: Using Docker Build & Run

```bash
# Build the image
docker build -t hemolink .

# Run the container
docker run -p 5000:5000 --env-file .env hemolink
```

## Accessing the Application

After deployment:
- **Application**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Deployment Platforms

### Deploy to Render (Docker)

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select "Docker" as environment
6. Add Environment Variables in dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=10000`
7. Deploy

### Deploy to Railway (Docker)

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Dockerfile
6. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
7. Deploy

### Deploy to DigitalOcean App Platform

1. Push your code to GitHub
2. Go to [DigitalOcean](https://www.digitalocean.com)
3. Click "Apps" → "Create App"
4. Select your GitHub repository
5. Select "Dockerfile" as source
6. Add Environment Variables
7. Deploy

## QR Code for Mobile Access

Once deployed, the QR code on the home page will automatically point to your deployed URL.

To update manually, edit `frontend/src/components/QRCode.jsx`:
```jsx
const appUrl = 'https://your-deployed-url.com';
```

## Troubleshooting

### Container exits immediately

Check logs:
```bash
docker-compose logs
```

Common causes:
- Missing environment variables
- MongoDB connection failed
- Port already in use

### MongoDB connection refused

- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `MONGODB_URI` is correct
- Ensure database user credentials are correct

### Frontend not loading

- Check if build completed successfully in Docker logs
- Verify `public` folder exists in backend directory

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Container             │
│  ┌─────────────────────────────┐   │
│  │   Nginx/Express (Port 5000)  │   │
│  │                             │   │
│  │  ┌─────────────────────┐    │   │
│  │  │  React Frontend      │    │   │
│  │  │  (Built static files)│    │   │
│  │  └─────────────────────┘    │   │
│  │                             │   │
│  │  ┌─────────────────────┐    │   │
│  │  │  Node.js Backend     │    │   │
│  │  │  API + Socket.IO     │    │   │
│  │  └─────────────────────┘    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              ▼
      ┌──────────────┐
      │ MongoDB Atlas │
      │  (Database)   │
      └──────────────┘
```

## Advantages of Docker Deployment

✅ **Single container** - Frontend and backend together
✅ **Easy deployment** - One command to build and run
✅ **Consistent environment** - Works same everywhere
✅ **Mobile accessible** - Deploy once, access anywhere
✅ **Scalable** - Easy to scale with Docker Swarm or Kubernetes
