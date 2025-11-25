#!/bin/bash
set -e

cd /var/app/current

echo "Installing dependencies..."
npm ci --only=production

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy || true
