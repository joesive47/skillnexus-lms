#!/bin/bash

# Railway Deployment Script for SkillNexus LMS
echo "🚀 Deploying SkillNexus to Railway..."

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
echo "Please login to Railway..."
railway login

# Create new project
railway new skillnexus-lms

# Add PostgreSQL database
railway add postgresql

# Set environment variables
echo "Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_URL=https://skillnexus-lms-production.up.railway.app

# Deploy application
echo "Deploying application..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://skillnexus-lms-production.up.railway.app"
echo "📊 Monitor usage at: https://railway.app/dashboard"