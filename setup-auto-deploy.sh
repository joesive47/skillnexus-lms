#!/bin/bash

echo "🚀 Setting up GitHub + Vercel Auto-Deploy..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Login to Vercel
echo "Please login to Vercel:"
vercel login

# Link project
echo "Linking project to Vercel..."
vercel link

# Get project info
echo "Getting project information..."
if [ -f ".vercel/project.json" ]; then
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*' | cut -d'"' -f4)
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
    
    echo ""
    echo "📋 Add these secrets to GitHub:"
    echo "Repository → Settings → Secrets and variables → Actions"
    echo ""
    echo "VERCEL_ORG_ID: $ORG_ID"
    echo "VERCEL_PROJECT_ID: $PROJECT_ID"
    echo "VERCEL_TOKEN: Get from https://vercel.com/account/tokens"
    echo ""
fi

# Commit and push
echo "Committing changes..."
git add .
git commit -m "Setup auto-deploy to Vercel"

echo ""
echo "✅ Setup complete!"
echo "Push to GitHub: git push origin main"
echo "Auto-deploy will trigger on every push to main branch"