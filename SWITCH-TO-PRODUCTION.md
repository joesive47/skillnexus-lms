# 🚀 Switch to Production Database - Quick Guide

## ⚡ Quick Start (5 Minutes)

### Option 1: Automated Script (Recommended)

**Windows:**
```bash
scripts\switch-to-production.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/switch-to-production.sh
./scripts/switch-to-production.sh
```

### Option 2: Manual Setup

```bash
# 1. Copy production template
cp .env.production .env

# 2. Edit .env and update DATABASE_URL
# Get DATABASE_URL from your provider:
# - Vercel Postgres: https://vercel.com/dashboard/stores
# - Supabase: https://app.supabase.com/project/_/settings/database
# - Neon: https://console.neon.tech

# 3. Generate secrets
openssl rand -base64 32  # Use for NEXTAUTH_SECRET
openssl rand -base64 32  # Use for AUTH_SECRET
openssl rand -base64 32  # Use for CERT_SIGNING_KEY

# 4. Run migrations
npx prisma generate
npx prisma migrate deploy

# 5. Seed data (optional)
npm run db:seed

# 6. Verify connection
npx prisma db pull
```

---

## 🗄️ Choose Your Database Provider

### 1. Vercel Postgres (Recommended for Vercel)
- ✅ Best integration with Vercel
- ✅ Auto-scaling
- ✅ Built-in connection pooling
- 💰 $0.29/GB storage

**Setup:**
1. Go to https://vercel.com/dashboard
2. Select your project → Storage → Create Database → Postgres
3. Copy `DATABASE_URL` from Environment Variables
4. Paste in `.env`

### 2. Supabase (Best Free Tier)
- ✅ 500MB free database
- ✅ Excellent dashboard
- ✅ Built-in Auth & Storage
- 💰 Free → $25/month

**Setup:**
1. Create project at https://supabase.com
2. Go to Settings → Database
3. Copy Connection String (Transaction mode)
4. Replace `[YOUR-PASSWORD]` with your password
5. Paste in `.env`

### 3. Neon (Best for Serverless)
- ✅ Serverless Postgres
- ✅ Auto-scaling to zero
- ✅ Fast cold starts
- 💰 Free 0.5GB → $19/month

**Setup:**
1. Create project at https://neon.tech
2. Copy Connection String
3. Paste in `.env`

---

## 📝 Environment Variables Checklist

Update these in your `.env`:

```bash
# Database (REQUIRED)
DATABASE_URL="your-production-database-url"

# Secrets (REQUIRED - Generate new ones!)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
CERT_SIGNING_KEY="generate-with-openssl-rand-base64-32"

# URLs (REQUIRED)
NEXTAUTH_URL="https://your-domain.com"
AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_URL="https://your-domain.com"

# Environment
NODE_ENV="production"
AUTH_TRUST_HOST="true"

# Redis (Optional but recommended)
REDIS_URL="your-redis-url"

# Stripe (If using payments)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

---

## ✅ Verification Steps

After setup, verify everything works:

```bash
# 1. Test database connection
npx prisma db pull

# 2. Check Prisma Studio
npx prisma studio

# 3. Run development server
npm run dev

# 4. Test login
# Go to http://localhost:3000/login
# Try logging in with test accounts
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Generated new `NEXTAUTH_SECRET`
- [ ] Generated new `AUTH_SECRET`
- [ ] Generated new `CERT_SIGNING_KEY`
- [ ] Updated all URLs to production domain
- [ ] Enabled SSL/TLS (`?sslmode=require` in DATABASE_URL)
- [ ] Added `.env` to `.gitignore`
- [ ] Never committed secrets to Git
- [ ] Setup database backups
- [ ] Enabled connection pooling
- [ ] Configured monitoring

---

## 🆘 Common Issues

### Issue: "Can't reach database server"

**Solution:**
```bash
# Make sure DATABASE_URL has SSL enabled
DATABASE_URL="postgresql://...?sslmode=require"

# Check if database is running
# Verify firewall/security group settings
```

### Issue: "Too many connections"

**Solution:**
```bash
# Add connection limit to DATABASE_URL
DATABASE_URL="postgresql://...?connection_limit=1&pgbouncer=true"
```

### Issue: "Migration failed"

**Solution:**
```bash
# Reset and retry (CAUTION: This deletes data!)
npx prisma migrate reset
npx prisma migrate deploy
```

---

## 📊 Database Providers Comparison

| Feature | Vercel | Supabase | Neon | Railway | AWS RDS |
|---------|--------|----------|------|---------|---------|
| Free Tier | ❌ | ✅ 500MB | ✅ 0.5GB | ❌ | ❌ |
| Price/Month | $0.29/GB | $25 | $19 | $5 | $15+ |
| Setup Time | 2 min | 3 min | 2 min | 3 min | 10 min |
| Auto-scaling | ✅ | ✅ | ✅ | ✅ | ⚙️ |
| Connection Pool | ✅ | ✅ | ✅ | ✅ | ⚙️ |
| Best For | Vercel apps | Startups | Serverless | Full-stack | Enterprise |

---

## 📚 Additional Resources

- **Full Setup Guide:** [PRODUCTION-DATABASE-SETUP.md](./PRODUCTION-DATABASE-SETUP.md)
- **Quick Reference:** [DATABASE-QUICK-REFERENCE.md](./DATABASE-QUICK-REFERENCE.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎯 Next Steps

After switching to production database:

1. **Test Locally**
   ```bash
   npm run dev
   # Test all features
   ```

2. **Deploy to Production**
   ```bash
   git push origin main
   # Or deploy via Vercel Dashboard
   ```

3. **Setup Monitoring**
   - Enable database monitoring
   - Setup alerts
   - Configure backups

4. **Performance Optimization**
   - Enable Redis caching
   - Setup CDN
   - Configure load balancing

---

**Need Help?** Check the full documentation or create an issue on GitHub.

**Ready to Deploy?** See [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) for deployment guide.
