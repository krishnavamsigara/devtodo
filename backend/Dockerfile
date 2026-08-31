# ==========================================
# Base Image
# ==========================================
FROM node:20-alpine AS base
WORKDIR /app
# Install openssl and libc6-compat for Prisma engine on Alpine, plus curl for healthcheck
RUN apk add --no-cache openssl libc6-compat curl

# ==========================================
# Dependencies Stage
# ==========================================
FROM base AS dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# ==========================================
# Testing Stage (DevOps CI Target)
# ==========================================
FROM dependencies AS tester
COPY . .
ENV NODE_ENV=test
RUN npm test

# ==========================================
# Production Runtime Stage
# ==========================================
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy dependencies and generated prisma client from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma
COPY package*.json ./
COPY prisma ./prisma/
COPY src ./src/
COPY docker-entrypoint.sh ./

# Make entrypoint executable and adjust ownership
RUN chmod +x docker-entrypoint.sh && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
