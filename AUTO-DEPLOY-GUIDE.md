# 🚀 Auto Deploy Guide - One Click to Production!

## ⚡ Quick Start (2 นาที)

### Option 1: Windows Auto Deploy (แนะนำ)

```bash
# รันสคริปต์เดียวจบ!
auto-deploy.bat
```

สคริปต์จะทำให้อัตโนมัติ:
- ✅ Install dependencies
- ✅ Generate Prisma Client
- ✅ Git commit & push
- ✅ แสดงขั้นตอนต่อไป

---

## 🔧 Setup ครั้งแรก (5 นาที)

### Step 1: Setup GitHub Repository

```bash
# ถ้ายังไม่มี remote
git remote add origin https://github.com/YOUR_USERNAME/The-SkillNexus.git

# ตรวจสอบ remote
git remote -v
```

### Step 2: Setup Vercel Account

1. ไปที่: https://vercel.com/signup
2. Login ด้วย GitHub
3. Import repository: `The-SkillNexus`

### Step 3: Setup Database (เลือก 1 อย่าง)

#### A. Vercel Postgres (แนะนำ - ง่ายที่สุด)
```bash
1. Go to: https://vercel.com/dashboard/stores
2. Click "Create Database" → "Postgres"
3. Copy DATABASE_URL (จะได้อัตโนมัติ)
```

#### B. Supabase (Free Tier)
```bash
1. Go to: https://supabase.com
2. Create new project
3. Settings → Database → Connection String
4. Copy "Connection pooling" URL
```

#### C. Neon (Serverless)
```bash
1. Go to: https://neon.tech
2. Create new project
3. Copy connection string
```

### Step 4: Add Environment Variables

ใน Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
```

**Generate Secret:**
```bash
# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Linux/Mac
openssl rand -base64 32
```

---

## 🚀 Deploy Now! (1 คำสั่ง)

### Windows:
```bash
auto-deploy.bat
```

### Linux/Mac:
```bash
chmod +x auto-deploy.sh
./auto-deploy.sh
```

---

## 🤖 Auto Deploy with GitHub Actions (ขั้นสูง)

### Setup GitHub Secrets

1. Go to: `https://github.com/YOUR_USERNAME/The-SkillNexus/settings/secrets/actions`
2. Add secrets:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
DATABASE_URL=your-database-url
```

**Get Vercel Token:**
```bash
1. Go to: https://vercel.com/account/tokens
2. Create new token
3. Copy token
```

**Get Org & Project ID:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# IDs will be in .vercel/project.json
```

### Enable Auto Deploy

หลังจาก setup แล้ว ทุกครั้งที่ push:

```bash
git add .
git commit -m "Update courses"
git push origin main
```

GitHub Actions จะ:
- ✅ Build project
- ✅ Deploy to Vercel
- ✅ Push database schema
- ✅ Seed 5 SCORM courses
- ✅ Verify deployment

---

## 📊 After Deployment

### 1. Verify Deployment

```bash
# Check if courses were created
npm run deploy:verify

# Expected output:
# ✅ Found 5 courses:
# 1. SDGs Leadership
# 2. Circular Economy
# 3. Social Entrepreneurship
# 4. Renewable Energy
# 5. Regenerative Agriculture
```

### 2. Test Login

```
URL: https://your-app.vercel.app/login

Student Account:
Email: joesive47@gmail.com
Password: Student@123!
Credits: 10,000
```

### 3. Browse Courses

```
https://your-app.vercel.app/dashboard/courses
```

---

## 🎯 What Gets Deployed

### 👥 Users (3)
- ✅ Admin: admin@skillnexus.com
- ✅ Teacher: teacher@skillnexus.com
- ✅ Student: joesive47@gmail.com (10,000 credits)

### 🌍 SCORM 2004 Courses (5)

| Course | Duration | Modules | Lessons | Price |
|--------|----------|---------|---------|-------|
| 🎯 SDGs Leadership | 8h | 4 | 12 | ฿4,999 |
| ♻️ Circular Economy | 6h | 4 | 12 | ฿3,999 |
| 💡 Social Entrepreneurship | 7h | 4 | 12 | ฿4,499 |
| ⚡ Renewable Energy | 6.5h | 4 | 12 | ฿3,799 |
| 🌱 Regenerative Agriculture | 6.3h | 4 | 12 | ฿3,599 |

**Total:** 33.8 hours | 60 lessons | ฿20,796

---

## 🔧 Troubleshooting

### ❌ "Git push failed"
```bash
# Check remote
git remote -v

# Add remote if missing
git remote add origin https://github.com/YOUR_USERNAME/The-SkillNexus.git

# Force push (ระวัง!)
git push -f origin main
```

### ❌ "Vercel build failed"
```bash
# Check build logs in Vercel Dashboard
# Common issues:
# 1. Missing environment variables
# 2. Prisma Client not generated
# 3. Database connection failed

# Fix:
# 1. Add all env vars in Vercel
# 2. Redeploy
```

### ❌ "Database connection failed"
```bash
# Test connection locally
npx prisma db pull

# Check DATABASE_URL format:
# ✅ postgresql://user:pass@host:5432/db?sslmode=require
# ❌ postgresql://user:pass@host:5432/db (missing sslmode)
```

### ❌ "No courses found"
```bash
# Run seed script manually
npm run deploy:quick

# Or full setup
npm run deploy:all
```

---

## 📈 Performance Tips

### 1. Enable Vercel Analytics
```bash
# In Vercel Dashboard:
# Settings → Analytics → Enable
```

### 2. Setup CDN for SCORM Files
```bash
# Use Vercel Edge Network (automatic)
# Or setup Cloudflare for public/scorm/
```

### 3. Database Connection Pooling
```env
# Add to DATABASE_URL
?pgbouncer=true&connection_limit=100
```

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Database created and connected
- [ ] Deployment successful
- [ ] Database seeded (5 courses)
- [ ] Test login works
- [ ] Courses visible in dashboard
- [ ] SCORM lessons accessible

---

## 📞 Support

Need help?
- 📖 Docs: [VERCEL-DEPLOY-NOW.md](./VERCEL-DEPLOY-NOW.md)
- 🌍 Courses: [WORLD-CHANGE-COURSES.md](./WORLD-CHANGE-COURSES.md)
- 📦 SCORM: [SCORM-DEPLOYMENT.md](./SCORM-DEPLOYMENT.md)

---

**🚀 Ready to Deploy! Run: `auto-deploy.bat` 🌍**
