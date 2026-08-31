# ==========================================
# Dependencies Stage
# ==========================================
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ==========================================
# Testing Stage (DevOps CI Target)
# ==========================================
FROM dependencies AS tester
WORKDIR /app
COPY . .
ENV NODE_ENV=test
RUN npm test

# ==========================================
# Builder Stage
# ==========================================
FROM dependencies AS builder
WORKDIR /app
COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ==========================================
# Production Runtime Stage (Nginx)
# ==========================================
FROM nginx:alpine AS runner

# Copy customized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
