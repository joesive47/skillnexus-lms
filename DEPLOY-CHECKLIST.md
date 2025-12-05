# ✅ Deployment Checklist - SkillNexus LMS

## 📋 Pre-Deployment Checklist

### 1. Environment Variables ✅
- [x] AUTH_SECRET generated: `hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=`
- [ ] DATABASE_URL (Production)
- [ ] NEXTAUTH_URL (Production URL)
- [ ] STRIPE_SECRET_KEY (Production)
- [ ] REDIS_URL (Optional)
- [ ] AWS_S3 credentials (Optional)

### 2. Database Setup
```bash
# Choose one:
# Option A: Vercel Postgres (Recommended)
# Option B: Supabase (Free tier)
# Option C: Neon (Serverless)
# Option D: Railway (Full-stack)
```

### 3. Vercel Environment Variables
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
NEXTAUTH_URL=https://your-app.vercel.app
AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
AUTH_URL=https://your-app.vercel.app
AUTH_TRUST_HOST=true
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

### 4. Git & GitHub
```bash
# Initialize and push
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skillnexus-lms.git
git push -u origin main
```

### 5. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import GitHub repository
3. Add environment variables
4. Click Deploy

### 6. Post-Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Pull env variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed
```

## 🎯 Quick Commands

### Generate New Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Test Local Build
```bash
npm run build
npm start
```

### Check Deployment
```bash
vercel logs --follow
```

## 🔐 Current Configuration

- ✅ AUTH_SECRET: Generated and configured
- ✅ Local database: PostgreSQL
- ⏳ Production database: Pending setup
- ⏳ Vercel deployment: Ready to deploy

## 📝 Next Steps

1. **Setup Production Database** (Choose one):
   - Vercel Postgres: https://vercel.com/dashboard/stores
   - Supabase: https://supabase.com
   - Neon: https://neon.tech
   - Railway: https://railway.app

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for production"
   git push origin main
   ```

3. **Deploy to Vercel**:
   - Import repository
   - Add environment variables
   - Deploy

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

## 🚀 Ready to Deploy!

Your SkillNexus LMS is configured and ready for deployment to Vercel.

**Estimated Time:** 5-10 minutes
**Cost:** Free tier available on all platforms
