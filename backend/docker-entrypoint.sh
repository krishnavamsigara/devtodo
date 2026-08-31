#!/bin/sh
set -e

echo "🔧 Checking database schema synchronization..."
# Push Prisma schema to database (works with Neon DB and Local Postgres)
npx prisma db push --skip-generate || echo "⚠️ Warning: Database schema sync skipped or had a non-fatal warning."

echo "🚀 Starting application server..."
exec "$@"
