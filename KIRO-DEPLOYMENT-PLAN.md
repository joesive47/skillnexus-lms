# 🚀 แผนการ Deploy SkillNexus LMS ไปยัง Vercel

**จัดทำโดย**: Kiro AI Assistant  
**วันที่**: 1 กุมภาพันธ์ 2026  
**เวอร์ชัน**: 1.0

---

## 📋 สารบัญ

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup](#database-setup)
3. [Vercel Configuration](#vercel-configuration)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Plan](#rollback-plan)

---

## ✅ Pre-Deployment Checklist

### 1. Code Preparation

```bash
# ตรวจสอบว่าอยู่ใน main branch
git branch

# Pull latest changes
git pull origin main

# ตรวจสอบ dependencies
npm install

# Generate Prisma Client
npx prisma generate

# ทดสอบ build local
npm run build
```

**Expected Output**:
- ✅ Build completes without errors
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ `.next` folder created successfully

### 2. Environment Variables Check

**Required Variables**:
```bash
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_SECRET          # Generate: openssl rand -base64 32
NEXTAUTH_URL             # https://your-domain.vercel.app
AUTH_SECRET              # Same as NEXTAUTH_SECRET
AUTH_URL                 # Same as NEXTAUTH_URL
AUTH_TRUST_HOST          # true
NODE_ENV                 # production
```

**Optional Variables**:
```bash
REDIS_URL                # Redis connection (for caching)
STRIPE_SECRET_KEY        # Payment processing
STRIPE_PUBLISHABLE_KEY   # Payment processing
AWS_ACCESS_KEY_ID        # File storage
AWS_SECRET_ACCESS_KEY    # File storage
AWS_REGION               # File storage region
AWS_S3_BUCKET            # File storage bucket
```

### 3. Files to Review

- [ ] `.env.production.example` - Template for production env
- [ ] `vercel.json` - Vercel configuration
- [ ] `.vercelignore` - Files to exclude from deployment
- [ ] `next.config.js` - Next.js configuration
- [ ] `package.json` - Dependencies and scripts
- [ ] `prisma/schema.prisma` - Database schema

---

## 🗄️ Database Setup

### Option 1: Vercel Postgres (แนะนำ)

**ข้อดี**:
- ✅ Integrated with Vercel
- ✅ Automatic connection pooling
- ✅ Easy setup
- ✅ Good performance

**ขั้นตอน**:

1. **Create Database**
   ```bash
   # ใน Vercel Dashboard
   1. Go to Storage tab
   2. Click "Create Database"
   3. Select "Postgres"
   4. Choose region (Singapore recommended)
   5. Click "Create"
   ```

2. **Get Connection String**
   ```bash
   # Vercel จะให้ connection string
   # Format: postgres://user:pass@host:5432/dbname
   
   # Copy ไปใส่ใน Environment Variables
   DATABASE_URL="postgres://..."
   ```

3. **Connect to Project**
   ```bash
   # ใน Vercel Dashboard
   1. Go to project settings
   2. Environment Variables
   3. Add DATABASE_URL
   4. Select all environments (Production, Preview, Development)
   ```

### Option 2: Supabase (Free Tier Available)

**ข้อดี**:
- ✅ Free tier: 500MB database
- ✅ Automatic backups
- ✅ Built-in auth (optional)
- ✅ Real-time subscriptions

**ขั้นตอน**:

1. **Create Project**
   ```bash
   1. Go to https://supabase.com
   2. Sign up / Login
   3. Create new project
   4. Choose region (Singapore)
   5. Set database password
   ```

2. **Get Connection String**
   ```bash
   # ใน Supabase Dashboard
   1. Go to Settings > Database
   2. Copy "Connection string"
   3. Replace [YOUR-PASSWORD] with your password
   
   # Format:
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

3. **Enable Connection Pooling**
   ```bash
   # ใน Supabase Dashboard
   1. Go to Settings > Database
   2. Copy "Connection pooling" string
   3. Use this for production (better performance)
   
   # Format:
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
   ```

### Option 3: Neon (Serverless PostgreSQL)

**ข้อดี**:
- ✅ Serverless (auto-scaling)
- ✅ Free tier: 3GB storage
- ✅ Instant branching
- ✅ Fast cold starts

**ขั้นตอน**:

1. **Create Project**
   ```bash
   1. Go to https://neon.tech
   2. Sign up / Login
   3. Create new project
   4. Choose region
   ```

2. **Get Connection String**
   ```bash
   # ใน Neon Dashboard
   1. Go to project dashboard
   2. Copy connection string
   
   # Format:
   DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   ```

### Database Migration

**หลังจากได้ DATABASE_URL แล้ว**:

```bash
# 1. Set environment variable locally (for testing)
export DATABASE_URL="postgresql://..."

# 2. Push schema to database
npx prisma db push

# 3. Verify tables created
npx prisma studio

# 4. (Optional) Seed initial data
npm run db:seed
```

**Expected Tables** (80+ tables):
- users, courses, lessons
- enrollments, certificates
- quizzes, assessments
- gamification tables
- security tables
- analytics tables

---

## ⚙️ Vercel Configuration

### 1. Connect GitHub Repository

```bash
# ใน Vercel Dashboard
1. Click "Add New Project"
2. Select "Import Git Repository"
3. Choose GitHub
4. Authorize Vercel
5. Select repository: uppowerskill-lms
6. Click "Import"
```

### 2. Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Build Settings**:
```bash
Build Command: prisma generate && next build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

**Root Directory**: `./` (leave as default)

### 3. Environment Variables

**ใน Vercel Dashboard > Settings > Environment Variables**:

```bash
# Database
DATABASE_URL = postgresql://...

# Authentication (Generate new secret!)
NEXTAUTH_SECRET = [generate-with-openssl-rand-base64-32]
NEXTAUTH_URL = https://your-project.vercel.app
AUTH_SECRET = [same-as-nextauth-secret]
AUTH_URL = https://your-project.vercel.app
AUTH_TRUST_HOST = true

# Environment
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1

# Optional: Redis (if using)
REDIS_URL = redis://...

# Optional: Stripe (if using)
STRIPE_SECRET_KEY = sk_live_...
STRIPE_PUBLISHABLE_KEY = pk_live_...

# Optional: AWS S3 (if using)
AWS_ACCESS_KEY_ID = ...
AWS_SECRET_ACCESS_KEY = ...
AWS_REGION = ap-southeast-1
AWS_S3_BUCKET = ...
```

**สำคัญ**: เลือก Environment สำหรับแต่ละตัวแปร
- ✅ Production
- ✅ Preview (optional)
- ⬜ Development (use local .env)

### 4. Generate NEXTAUTH_SECRET

**Windows (PowerShell)**:
```powershell
# Method 1: Using OpenSSL (if installed)
openssl rand -base64 32

# Method 2: Using PowerShell
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Method 3: Online generator
# https://generate-secret.vercel.app/32
```

**Linux/Mac**:
```bash
openssl rand -base64 32
```

---

## 🚀 Deployment Steps

### Step 1: Initial Deployment

```bash
# 1. Commit all changes
git add .
git commit -m "Ready for production deployment"

# 2. Push to GitHub
git push origin main

# 3. Vercel will auto-deploy
# Monitor at: https://vercel.com/dashboard
```

**Deployment Process**:
1. ⏳ Building (2-3 minutes)
2. ⏳ Deploying
3. ✅ Ready

**Check Deployment**:
- Build logs: Look for errors
- Function logs: Check for runtime errors
- Preview URL: Test the deployment

### Step 2: Database Migration

**After first successful deployment**:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy

# Option 2: Using Vercel Dashboard
# Go to project > Settings > Functions
# Add build command: prisma generate && prisma migrate deploy && next build
```

### Step 3: Verify Deployment

**Test Checklist**:

1. **Homepage**
   - [ ] Loads without errors
   - [ ] Styling is correct
   - [ ] Navigation works

2. **Authentication**
   - [ ] Login page loads
   - [ ] Can create account
   - [ ] Can login
   - [ ] Session persists

3. **Core Features**
   - [ ] Can view courses
   - [ ] Can enroll in course
   - [ ] Video player works
   - [ ] Quiz submission works

4. **Admin Features**
   - [ ] Admin dashboard accessible
   - [ ] Can create courses
   - [ ] Can manage users

5. **Performance**
   - [ ] Page load < 3 seconds
   - [ ] No console errors
   - [ ] Images load properly

### Step 4: Custom Domain (Optional)

```bash
# ใน Vercel Dashboard
1. Go to project > Settings > Domains
2. Add your domain
3. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

4. Wait for DNS propagation (5-30 minutes)
5. Vercel will auto-provision SSL certificate
```

---

## 🔍 Post-Deployment

### 1. Monitoring Setup

**Vercel Analytics**:
```bash
# ใน Vercel Dashboard
1. Go to project > Analytics
2. Enable Analytics
3. View real-time metrics:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics
```

**Error Tracking**:
```bash
# ใน Vercel Dashboard
1. Go to project > Logs
2. Monitor:
   - Build logs
   - Function logs
   - Edge logs
3. Set up alerts for errors
```

### 2. Performance Optimization

**Enable Edge Functions**:
```javascript
// In route files
export const runtime = 'edge';
```

**Configure ISR (Incremental Static Regeneration)**:
```javascript
// In page files
export const revalidate = 3600; // 1 hour
```

**Optimize Images**:
```javascript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
/>
```

### 3. Security Hardening

**Headers Configuration** (next.config.js):
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

**Rate Limiting**:
- Already implemented in `/src/lib/rate-limiter.ts`
- Monitor in production logs

### 4. Backup Strategy

**Database Backups**:
```bash
# Vercel Postgres: Automatic daily backups
# Supabase: Automatic daily backups
# Neon: Automatic backups

# Manual backup:
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Code Backups**:
```bash
# GitHub is primary backup
# Additional: Download repository archive monthly
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Fails

**Error**: "Cannot find module '@prisma/client'"
```bash
# Solution:
# Add to vercel.json:
{
  "buildCommand": "prisma generate && next build"
}
```

**Error**: "Out of memory"
```bash
# Solution:
# Add to vercel.json:
{
  "env": {
    "NODE_OPTIONS": "--max-old-space-size=4096"
  }
}
```

#### 2. Database Connection Fails

**Error**: "Can't reach database server"
```bash
# Check:
1. DATABASE_URL is correct
2. Database is running
3. Firewall allows Vercel IPs
4. SSL mode is correct (?sslmode=require)

# Test connection:
npx prisma db pull
```

**Error**: "Too many connections"
```bash
# Solution:
# Use connection pooling
# Supabase: Use port 6543 with ?pgbouncer=true
# Neon: Built-in pooling
# Vercel Postgres: Built-in pooling
```

#### 3. Authentication Issues

**Error**: "NEXTAUTH_URL is not set"
```bash
# Solution:
# Set in Vercel environment variables:
NEXTAUTH_URL=https://your-domain.vercel.app
AUTH_URL=https://your-domain.vercel.app
```

**Error**: "Invalid session"
```bash
# Solution:
# Generate new NEXTAUTH_SECRET
# Update in Vercel environment variables
# Redeploy
```

#### 4. Performance Issues

**Slow page loads**:
```bash
# Check:
1. Database query optimization
2. Enable Redis caching
3. Use CDN for static assets
4. Enable ISR for static pages
5. Optimize images

# Monitor:
- Vercel Analytics
- Function execution time
- Database query time
```

---

## 🔄 Rollback Plan

### Quick Rollback

**ใน Vercel Dashboard**:
```bash
1. Go to project > Deployments
2. Find last working deployment
3. Click "..." menu
4. Select "Promote to Production"
5. Confirm
```

**Time**: ~30 seconds

### Git Rollback

```bash
# 1. Find last working commit
git log --oneline

# 2. Revert to that commit
git revert <commit-hash>

# 3. Push to trigger new deployment
git push origin main
```

**Time**: ~3-5 minutes

### Database Rollback

```bash
# 1. Restore from backup
pg_restore -d $DATABASE_URL backup_file.sql

# 2. Or use provider's backup restore
# Vercel Postgres: Dashboard > Backups > Restore
# Supabase: Dashboard > Database > Backups > Restore
# Neon: Dashboard > Branches > Restore
```

**Time**: ~5-15 minutes

---

## 📊 Success Metrics

### Deployment Success Criteria

- ✅ Build completes without errors
- ✅ All pages load correctly
- ✅ Authentication works
- ✅ Database connection stable
- ✅ No critical errors in logs
- ✅ Performance meets targets (<3s page load)

### Post-Deployment Monitoring (First 24 hours)

**Monitor**:
- Error rate < 1%
- Response time < 100ms (API)
- Page load < 3s
- Uptime > 99.9%
- No database connection issues

**Alert Thresholds**:
- Error rate > 5%: Investigate immediately
- Response time > 500ms: Check performance
- Uptime < 99%: Check infrastructure

---

## 📞 Support Contacts

### Technical Issues
- **Vercel Support**: https://vercel.com/support
- **Database Provider Support**: [Your provider's support]
- **GitHub Issues**: Create issue in repository

### Emergency Contacts
- **Primary**: [Your contact]
- **Secondary**: [Backup contact]
- **On-call**: [On-call contact]

---

## ✅ Final Checklist

### Before Deployment
- [ ] Code reviewed and tested
- [ ] Database provider selected and configured
- [ ] Environment variables prepared
- [ ] Vercel project created
- [ ] GitHub repository connected
- [ ] Team notified of deployment

### During Deployment
- [ ] Monitor build logs
- [ ] Check for errors
- [ ] Verify deployment URL
- [ ] Test core functionality
- [ ] Check database connection

### After Deployment
- [ ] Run full test suite
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Update documentation
- [ ] Notify stakeholders

---

## 🎉 Deployment Complete!

**Congratulations!** SkillNexus LMS is now live on Vercel! 🚀

**Next Steps**:
1. Monitor for 24 hours
2. Gather user feedback
3. Plan next iteration
4. Celebrate success! 🎊

---

**จัดทำโดย**: Kiro AI Assistant  
**วันที่**: 1 กุมภาพันธ์ 2026  
**สถานะ**: Ready for Deployment ✅
