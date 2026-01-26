#!/bin/bash
# Auto-seed AI Architect course after deployment

echo "🚀 Seeding AI Architect course..."

# Wait for deployment to be ready
sleep 5

# Call seed API
curl -X POST https://uppoerskill.vercel.app/api/seed/ai-architect

echo "✅ Course seeded successfully!"
