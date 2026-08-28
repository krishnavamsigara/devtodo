# Base node image with openssl for Prisma support on Alpine
FROM node:20-alpine

# Install openssl for Prisma client compatibility
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Default build-time DATABASE_URL for Prisma client generation
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postsdb?schema=public"

# Install dependencies and generate Prisma client
RUN npm ci && npx prisma generate

# Copy application source files
COPY . .

# Expose backend service port
EXPOSE 5000

# Set default environment to production
ENV NODE_ENV=production

# Run database migrations and start application
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
