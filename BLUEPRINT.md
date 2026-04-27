# HemoLink Architecture & Deployment Blueprint

This document outlines the "Blueprint" for the HemoLink platform, specifically how the Backend, Frontend, and Database work together and how they are automatically deployed.

## 1. Infrastructure Overview (The Blueprint)

The project now uses **Render Blueprints**. This means the entire infrastructure is defined in the `render.yaml` file in the project root.

### Components:
- **Client (Frontend)**: React.js application.
  - Hosted as a **Static Site** on Render.
  - Communicates with the API via HTTPS and WebSockets.
- **API (Backend)**: Node.js/Express server.
  - Hosted as a **Web Service** on Render.
  - Handles authentication, business logic, and real-time events (Socket.io).
- **Database**: MongoDB Atlas (Cloud).
  - Stores user data, blood requests, and messages.

## 2. Deployment Workflow

Deploying the "Blueprint" is now a 1-click process:

1.  **Push to GitHub**: Make sure your local code is committed and pushed to your repo.
2.  **Go to Render**: Log in to dashboard.render.com.
3.  **New Blueprint**: Click `New +` -> `Blueprint`.
4.  **Connect Repo**: Select your `HemoLink` repository.
5.  **Configure**: Render will read the `render.yaml` file and automatically ask for:
    *   `MONGODB_URI`: Provide your Atlas connection string (already provided in .env).
6.  **Done**: Render will create both the backend and frontend at once. It automatically connects the frontend to the backend URL!

## 3. Environment Variables Map

| Variable | Source/Service | Purpose |
| :--- | :--- | :--- |
| `MONGODB_URI` | Manual (Atlas) | Database credentials |
| `JWT_SECRET` | Auto-generated | Secures user login tokens |
| `FRONTEND_URL` | Auto-filled by Blueprint | Allows frontend to talk to backend (CORS) |
| `REACT_APP_API_URL` | Auto-filled by Blueprint | Tells React where the backend lives |
