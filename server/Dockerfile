# ---- Builder: install dev deps and compile TS ----
  FROM node:20-alpine AS builder
  WORKDIR /app
  
  # Install build dependencies for native modules like bcrypt
  RUN apk add --no-cache python3 make g++
  
  # Only copy manifest first for better caching
  COPY package*.json ./
  RUN npm ci
  
  # Copy tsconfig and sources
  COPY tsconfig*.json ./
  COPY src/ ./src/
  
  # Compile TypeScript using the local tsc (from devDependencies)
  RUN npx tsc
  
  # ---- Runtime: small prod image with only prod deps + compiled JS ----
  FROM node:20-alpine AS runtime
  WORKDIR /app
  
  # Install build dependencies for production native modules
  RUN apk add --no-cache python3 make g++
  
  # Copy only package manifests and install prod deps
  COPY package*.json ./
  RUN npm ci --omit=dev
  
  # Copy compiled output from builder
  COPY --from=builder /app/dist ./dist
  
  ENV NODE_ENV=production
  ENV PORT=3001
  EXPOSE 3001
  
  CMD ["node", "dist/server.js"]