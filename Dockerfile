# ───────────── STAGE 1: Build React frontend ─────────────
FROM node:18 AS frontend-build

# Set working directory inside container
WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend code and build it
COPY frontend/ .
RUN npm run build


# ───────────── STAGE 2: Setup backend and copy frontend build ─────────────
FROM node:18

# Set working directory inside container
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend code
COPY backend ./backend

# Copy built frontend into backend/public
COPY --from=frontend-build /app/frontend/build ./backend/public

# Set working directory to backend folder for running
WORKDIR /app/backend

# Expose backend server port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
