# 🚀 Quick Deploy Commands

## 1️⃣ Generate Secrets
```bash
node scripts/generate-secrets.js
```

## 2️⃣ Push to GitHub
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

## 3️⃣ Deploy to Vercel
```bash
# Install Vercel CLI (first time only)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 4️⃣ Setup Database
```bash
# Pull environment variables
vercel env pull

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

## 5️⃣ Verify
```bash
# Open in browser
vercel open

# Check logs
vercel logs
```

---

## 📋 Environment Variables for Vercel

Copy to Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=
NEXTAUTH_SECRET=Rmi2F8HIWcXQvxmoCOxOfIQsmCLDMPrDy2hrSKDl8lo=
AUTH_SECRET=tch63q5u0+UQ0Yc90XFc5mYQOx+3hTOhljCF1dIGO6c=
NEXTAUTH_URL=https://your-app.vercel.app
AUTH_URL=https://your-app.vercel.app
AUTH_TRUST_HOST=true
NODE_ENV=production
NEXT_PUBLIC_URL=https://your-app.vercel.app
CERT_SIGNING_KEY=+wz/h8Lz2Cx6l03q3J4zEDjPh8Plm5SyGlJkhPk5a08=
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

## 🗄️ Database Options

### Vercel Postgres
```bash
# Create in Vercel Dashboard → Storage → Create Database
# Copy DATABASE_URL automatically
```

### Supabase
```bash
# 1. Create project: https://supabase.com
# 2. Get connection string from Settings → Database
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?pgbouncer=true
```

### Neon
```bash
# 1. Create project: https://neon.tech
# 2. Copy connection string
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
```

---

## ✅ Done!

Your app is live! 🎉
