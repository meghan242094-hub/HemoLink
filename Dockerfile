# Multi-stage Dockerfile for HemoLink
# Builds both frontend and backend in one image

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Backend
FROM node:18-alpine
WORKDIR /app

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production --silent

# Copy backend source
COPY backend/ ./

# Copy built frontend from stage 1
COPY --from=frontend-build /app/frontend/build ./public

# Serve frontend static files from backend
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
