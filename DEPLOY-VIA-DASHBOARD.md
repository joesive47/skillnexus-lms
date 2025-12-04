# 🚀 Deploy via Vercel Dashboard (Easiest Method)

## ✅ Step 1: Push to GitHub (Done!)

Your code is already on GitHub: https://github.com/joesive47/skillnexus-lms

---

## 🌐 Step 2: Deploy via Vercel Dashboard

### 2.1 Go to Vercel
1. Open: https://vercel.com/new
2. Login with GitHub

### 2.2 Import Repository
1. Click "Import Git Repository"
2. Select: `joesive47/skillnexus-lms`
3. Click "Import"

### 2.3 Configure Project
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** ./
- **Build Command:** `prisma generate && next build`
- **Output Directory:** .next
- **Install Command:** `npm install`

### 2.4 Add Environment Variables
Click "Environment Variables" and add:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillnexus?schema=public
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

**⚠️ Important:** Replace `your-app` with your actual Vercel app name after deployment!

### 2.5 Deploy
Click "Deploy" button

---

## 🗄️ Step 3: Setup Production Database

### Option A: Vercel Postgres (Recommended)

1. Go to your project in Vercel Dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Click "Continue"
6. Database will be created and DATABASE_URL will be automatically added to environment variables
7. Click "Redeploy" to use new database

### Option B: Supabase (Free)

1. Go to https://supabase.com
2. Create New Project
3. Wait for database to be ready (2 minutes)
4. Go to Settings → Database
5. Copy "Connection string" (Transaction mode)
6. Replace `[YOUR-PASSWORD]` with your actual password
7. Go to Vercel Dashboard → Settings → Environment Variables
8. Update `DATABASE_URL` with Supabase connection string
9. Click "Redeploy"

**Supabase Connection String Format:**
```
postgresql://postgres:YourPassword@db.abcdefghijklmnop.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

---

## 🔄 Step 4: Update URLs

After deployment, Vercel will give you a URL like: `https://skillnexus-lms-xyz.vercel.app`

1. Go to Settings → Environment Variables
2. Update these variables with your actual URL:
   - `NEXTAUTH_URL=https://skillnexus-lms-xyz.vercel.app`
   - `AUTH_URL=https://skillnexus-lms-xyz.vercel.app`
   - `NEXT_PUBLIC_URL=https://skillnexus-lms-xyz.vercel.app`
3. Click "Save"
4. Go to Deployments tab
5. Click "Redeploy" on latest deployment

---

## 🌱 Step 5: Seed Database (Optional)

### Via Vercel CLI (if installed):
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull
npx prisma db seed
```

### Or manually via Prisma Studio:
1. Install Prisma Studio: `npm i -g prisma`
2. Run: `npx prisma studio`
3. Manually add test users

---

## ✅ Step 6: Verify Deployment

1. Open your app: `https://your-app.vercel.app`
2. Go to login: `https://your-app.vercel.app/login`
3. Test with admin account:
   - Email: admin@skillnexus.com
   - Password: Admin@123!

---

## 🎉 Success!

Your SkillNexus LMS is now live!

**Next Steps:**
- [ ] Test all features
- [ ] Add custom domain (optional)
- [ ] Setup monitoring
- [ ] Configure backups

---

## 🆘 Troubleshooting

### Build Failed
- Check build logs in Vercel Dashboard
- Verify all environment variables are set
- Check for TypeScript errors

### Database Connection Error
- Verify DATABASE_URL format
- Ensure SSL mode is enabled
- Check database is accessible

### Can't Login
- Verify NEXTAUTH_URL matches your deployment URL
- Check AUTH_SECRET is set
- Ensure database has users (run seed)

---

## 📚 Resources

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Supabase Dashboard: https://app.supabase.com
- Prisma Docs: https://www.prisma.io/docs
