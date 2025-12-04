# 🚀 Deploy to Vercel - Quick Guide (10 Minutes)

## ✅ Pre-Deployment Checklist

- [x] Local development working
- [x] Database configured
- [ ] GitHub repository ready
- [ ] Vercel account created
- [ ] Production database ready

---

## 📋 Step-by-Step Deployment

### Step 1: Setup Production Database (5 min)

**Option A: Vercel Postgres (Recommended)**
```bash
# Will setup after deploying to Vercel
# Vercel Dashboard → Storage → Create Database → Postgres
```

**Option B: Supabase (Free)**
1. Go to https://supabase.com
2. Create New Project
3. Settings → Database → Copy Connection String
4. Save for Step 4

---

### Step 2: Push to GitHub (2 min)

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - SkillNexus LMS"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/skillnexus-lms.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Vercel (2 min)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy" (don't configure yet)

---

### Step 4: Configure Environment Variables (3 min)

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Database (Choose one)
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?pgbouncer=true

# Or Vercel Postgres (after creating in Storage tab)
DATABASE_URL=postgres://default:PASSWORD@HOST-pooler.postgres.vercel-storage.com:5432/verceldb?sslmode=require

# Authentication (Generate new secrets!)
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_HERE
AUTH_SECRET=YOUR_GENERATED_SECRET_HERE
NEXTAUTH_URL=https://your-app.vercel.app
AUTH_URL=https://your-app.vercel.app
AUTH_TRUST_HOST=true
NODE_ENV=production
NEXT_PUBLIC_URL=https://your-app.vercel.app

# Certificate Signing
CERT_SIGNING_KEY=YOUR_GENERATED_SECRET_HERE

# RAG System
RAG_CHUNK_SIZE=600
RAG_CHUNK_OVERLAP=50
RAG_MAX_RESULTS=3
RAG_BATCH_SIZE=10
RAG_MAX_CONCURRENT=5
RAG_CACHE_SIZE=2000
RAG_ENABLE_PRELOAD=true
RAG_FAST_MODE=true
RAG_SIMILARITY_THRESHOLD=0.25
```

**Generate Secrets:**
```bash
# Run this 3 times for different secrets
openssl rand -base64 32
```

---

### Step 5: Setup Database Schema (2 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy --schema=./prisma/schema.prisma
npx prisma db seed
```

**Or use Vercel Dashboard:**
1. Deployments → Latest → View Function Logs
2. Run migration command in terminal

---

### Step 6: Redeploy (1 min)

```bash
# Trigger redeploy
git commit --allow-empty -m "Trigger redeploy"
git push

# Or in Vercel Dashboard
# Deployments → Latest → Redeploy
```

---

## 🎯 Quick Deploy Commands

```bash
# 1. Generate secrets
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -base64 32  # AUTH_SECRET
openssl rand -base64 32  # CERT_SIGNING_KEY

# 2. Push to GitHub
git add .
git commit -m "Deploy to production"
git push

# 3. Deploy to Vercel
vercel --prod

# 4. Run migrations
vercel env pull
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔐 Environment Variables Template

Copy this to Vercel → Settings → Environment Variables:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
AUTH_SECRET=
NEXTAUTH_URL=
AUTH_URL=
AUTH_TRUST_HOST=true
NODE_ENV=production
NEXT_PUBLIC_URL=
CERT_SIGNING_KEY=
RAG_CHUNK_SIZE=600
RAG_CHUNK_OVERLAP=50
RAG_MAX_RESULTS=3
RAG_BATCH_SIZE=10
RAG_MAX_CONCURRENT=5
RAG_CACHE_SIZE=2000
RAG_ENABLE_PRELOAD=true
RAG_FAST_MODE=true
RAG_SIMILARITY_THRESHOLD=0.25
```

---

## ✅ Post-Deployment Checklist

- [ ] Site is live at https://your-app.vercel.app
- [ ] Database connected (check logs)
- [ ] Can login with test accounts
- [ ] Test admin features
- [ ] Test student enrollment
- [ ] Test video playback
- [ ] Test quiz functionality
- [ ] Check certificate generation

---

## 🆘 Troubleshooting

### Build Failed
```bash
# Check build logs in Vercel Dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Prisma client not generated
```

### Database Connection Failed
```bash
# Verify DATABASE_URL format
# Check if database is accessible
# Ensure SSL mode is enabled (?sslmode=require)
```

### 500 Internal Server Error
```bash
# Check Function Logs in Vercel
# Verify all environment variables are set
# Run migrations: npx prisma migrate deploy
```

---

## 🎉 Success!

Your SkillNexus LMS is now live! 🚀

**Next Steps:**
1. Setup custom domain (optional)
2. Configure SSL certificate
3. Setup monitoring
4. Enable analytics
5. Configure backups

---

**Need Help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.
