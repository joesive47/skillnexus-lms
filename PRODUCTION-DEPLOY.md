# 🚀 Production Deployment Guide

## Quick Deploy to Vercel (5 นาที)

### 1. Database Setup
Choose one of these PostgreSQL providers:

**Vercel Postgres (Recommended):**
```bash
# In Vercel dashboard:
# Storage → Create Database → Postgres
# Copy connection string
```

**Supabase (Free tier):**
```bash
# 1. Go to https://supabase.com
# 2. Create project
# 3. Get connection string from Settings → Database
```

**Neon (Serverless):**
```bash
# 1. Go to https://neon.tech
# 2. Create project
# 3. Copy connection string
```

### 2. Environment Variables
Set these in Vercel dashboard:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Auth (Generate new secret!)
NEXTAUTH_SECRET="your-production-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"
AUTH_SECRET="your-production-secret-here"
AUTH_URL="https://your-app.vercel.app"

# Required
NODE_ENV="production"
AUTH_TRUST_HOST="true"
```

### 3. Deploy Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Setup Database:**
   ```bash
   # After deployment, run in Vercel Functions tab:
   npm run migrate:production
   ```

### 4. Post-Deployment

1. **Test Login:**
   - Visit your deployed URL
   - Try logging in with test accounts
   - Check admin dashboard

2. **Performance Check:**
   - Visit `/api/health` - should return OK
   - Visit `/api/metrics` - check performance
   - Test course creation and video playback

## 🔧 Migration Commands

```bash
# Local development
npm run db:migrate
npm run db:seed

# Production (run once after deploy)
npm run migrate:production
```

## 🛡️ Security Checklist

- [ ] New NEXTAUTH_SECRET generated
- [ ] Production DATABASE_URL set
- [ ] No development URLs in env vars
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables secured

## 📊 Performance Targets

After deployment, expect:
- ⚡ Response time: <200ms
- 🌍 Global CDN: Automatic
- 📈 Concurrent users: 1000+
- 💾 Database: Optimized queries
- 🔄 Caching: Multi-layer enabled

## 🆘 Troubleshooting

**Database Connection Issues:**
```bash
# Check connection string format
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**Build Failures:**
```bash
# Clear cache and rebuild
npm run build:clean
```

**Migration Errors:**
```bash
# Reset and re-migrate
npx prisma migrate reset --force
npx prisma migrate deploy
```

## 📞 Support

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**🎉 Your SkillNexus LMS is ready for production! 🚀**