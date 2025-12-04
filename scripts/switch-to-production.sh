#!/bin/bash

# 🚀 Switch to Production Database Script
# This script helps you switch from development to production database

echo "🚀 SkillNexus LMS - Production Database Setup"
echo "=============================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found!"
    echo "📝 Please create .env.production first"
    echo "   You can copy from .env.production template"
    exit 1
fi

# Backup current .env
echo "📦 Backing up current .env..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"
echo ""

# Ask for confirmation
echo "⚠️  WARNING: This will replace your current .env with production settings"
echo "   Current DATABASE_URL will be replaced"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Copy production env
echo "📝 Copying production environment..."
cp .env.production .env
echo "✅ Production environment activated"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Ask if user wants to run migrations
echo "🗄️  Database Migration"
read -p "Run database migrations? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Running migrations..."
    npx prisma migrate deploy
    echo "✅ Migrations completed"
    echo ""
fi

# Ask if user wants to seed data
echo "🌱 Database Seeding"
read -p "Seed production database? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run db:seed
    echo "✅ Database seeded"
    echo ""
fi

# Test connection
echo "🔍 Testing database connection..."
if npx prisma db pull > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed!"
    echo "   Please check your DATABASE_URL in .env"
    exit 1
fi

echo ""
echo "🎉 Production database setup complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Verify DATABASE_URL in .env"
echo "   2. Check all environment variables"
echo "   3. Test your application"
echo "   4. Deploy to production"
echo ""
echo "🔐 Security Reminders:"
echo "   - Never commit .env to Git"
echo "   - Use strong secrets"
echo "   - Enable SSL/TLS"
echo "   - Setup regular backups"
echo ""
