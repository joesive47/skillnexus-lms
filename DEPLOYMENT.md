# 🚀 SkillNexus LMS Deployment Guide

## Quick Deploy Options

### 1. 🌐 Vercel (Recommended for Development)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### 2. 🚀 Railway
```bash
# Connect to Railway
railway login
railway link
railway up
```

### 3. ☁️ AWS (Production)
```bash
# Use existing AWS deployment scripts
./deploy-aws.bat
```

### 4. 🐳 Docker
```bash
# Build and run with Docker
docker-compose up -d
```

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Optional: Redis for caching
REDIS_URL="redis://..."

# Optional: AWS S3 for file uploads
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
AWS_S3_BUCKET="..."
```

## Pre-deployment Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Run database migrations: `npm run db:push`
- [ ] Seed initial data: `npm run db:seed`
- [ ] Test build: `npm run build`

## Post-deployment Steps

1. Access admin panel: `/dashboard/admin`
2. Create admin account with: `admin@skillnexus.com / admin123`
3. Upload course content
4. Configure payment methods (if needed)
5. Set up SSL certificate

## Support

For deployment issues, check:
- [AWS Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)