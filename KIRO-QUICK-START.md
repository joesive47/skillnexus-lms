# 🚀 Quick Start Guide - SkillNexus LMS

**จัดทำโดย**: Kiro AI Assistant  
**สำหรับ**: การเริ่มต้นใช้งานอย่างรวดเร็ว  
**เวลาที่ใช้**: 15-30 นาที

---

## 🎯 เป้าหมาย

Deploy SkillNexus LMS ไปยัง Vercel ภายใน 30 นาที!

---

## ✅ สิ่งที่ต้องเตรียม

### บัญชีที่จำเป็น
- [x] GitHub Account (joesive47@gmail.com) ✅
- [x] Vercel Account ✅
- [ ] Database Provider Account (เลือก 1 อัน):
  - Vercel Postgres (แนะนำ)
  - Supabase (มี free tier)
  - Neon (serverless)

### เครื่องมือที่ต้องมี
- [x] Git installed ✅
- [x] Node.js 18+ installed ✅
- [x] npm installed ✅
- [ ] OpenSSL (สำหรับ generate secret)

---

## 🚀 ขั้นตอนการ Deploy (5 ขั้นตอน)

### ขั้นตอนที่ 1: เตรียม Database (5 นาที)

#### Option A: Vercel Postgres (แนะนำ - ง่ายที่สุด)

```bash
1. ไปที่ https://vercel.com/dashboard
2. คลิก "Storage" tab
3. คลิก "Create Database"
4. เลือก "Postgres"
5. เลือก Region: Singapore
6. คลิก "Create"
7. Copy "DATABASE_URL" (จะใช้ในขั้นตอนถัดไป)
```

**ตัวอย่าง DATABASE_URL**:
```
postgres://default:xxx@xxx-pooler.aws.neon.tech:5432/verceldb?sslmode=require
```

#### Option B: Supabase (มี Free Tier)

```bash
1. ไปที่ https://supabase.com
2. Sign up / Login
3. คลิก "New Project"
4. ตั้งชื่อโปรเจค
5. เลือก Region: Singapore
6. ตั้ง Database Password (จดไว้!)
7. คลิก "Create Project"
8. รอ 2-3 นาที
9. ไปที่ Settings > Database
10. Copy "Connection string" (URI)
11. แทนที่ [YOUR-PASSWORD] ด้วย password ที่ตั้งไว้
```

**ตัวอย่าง DATABASE_URL**:
```
postgresql://postgres:YOUR-PASSWORD@db.xxx.supabase.co:5432/postgres
```

### ขั้นตอนที่ 2: Generate Secrets (2 นาที)

#### Windows (PowerShell)
```powershell
# เปิด PowerShell และรันคำสั่งนี้
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
Write-Host "Your NEXTAUTH_SECRET: $secret"
```

#### Linux/Mac
```bash
openssl rand -base64 32
```

#### หรือใช้ Online Generator
```
https://generate-secret.vercel.app/32
```

**จดค่า SECRET ที่ได้ไว้!** จะใช้ในขั้นตอนถัดไป

### ขั้นตอนที่ 3: Push Code to GitHub (3 นาที)

```bash
# 1. เปิด Terminal/Command Prompt
cd path/to/uppowerskill-lms

# 2. ตรวจสอบว่าอยู่ใน main branch
git branch

# 3. Commit changes (ถ้ามี)
git add .
git commit -m "Ready for Vercel deployment"

# 4. Push to GitHub
git push origin main

# 5. ตรวจสอบว่า push สำเร็จ
# ไปดูที่ https://github.com/your-username/uppowerskill-lms
```

### ขั้นตอนที่ 4: Deploy to Vercel (10 นาที)

#### 4.1 Import Project
```bash
1. ไปที่ https://vercel.com/new
2. คลิก "Import Git Repository"
3. เลือก GitHub
4. Authorize Vercel (ถ้ายังไม่ได้ทำ)
5. เลือก repository: uppowerskill-lms
6. คลิก "Import"
```

#### 4.2 Configure Project
```bash
# Framework Preset: Next.js (auto-detected) ✅
# Root Directory: ./ (default) ✅
# Build Command: prisma generate && next build ✅
# Output Directory: .next ✅
# Install Command: npm install ✅
```

#### 4.3 Add Environment Variables

**คลิก "Environment Variables" และเพิ่มตัวแปรเหล่านี้**:

```bash
# 1. Database
DATABASE_URL = [paste-your-database-url-from-step-1]

# 2. Authentication
NEXTAUTH_SECRET = [paste-secret-from-step-2]
NEXTAUTH_URL = https://your-project.vercel.app
AUTH_SECRET = [same-as-nextauth-secret]
AUTH_URL = https://your-project.vercel.app
AUTH_TRUST_HOST = true

# 3. Environment
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

**สำคัญ**: 
- เลือก Environment: **Production** ✅
- NEXTAUTH_URL และ AUTH_URL จะได้หลัง deploy (ใช้ชื่อโปรเจคของคุณ)

#### 4.4 Deploy!
```bash
คลิก "Deploy" และรอ 2-3 นาที
```

### ขั้นตอนที่ 5: Setup Database (5 นาที)

#### 5.1 Update Environment Variables

```bash
# หลังจาก deploy สำเร็จ คุณจะได้ URL เช่น:
# https://uppowerskill-lms-xxx.vercel.app

# 1. ไปที่ Vercel Dashboard
# 2. เลือกโปรเจค
# 3. ไปที่ Settings > Environment Variables
# 4. แก้ไข NEXTAUTH_URL และ AUTH_URL:

NEXTAUTH_URL = https://uppowerskill-lms-xxx.vercel.app
AUTH_URL = https://uppowerskill-lms-xxx.vercel.app

# 5. คลิก "Save"
# 6. Redeploy (Deployments > ... > Redeploy)
```

#### 5.2 Run Database Migrations

**Option A: ใช้ Vercel CLI (แนะนำ)**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Pull environment variables
vercel env pull .env.production

# 5. Run migrations
npx prisma migrate deploy

# หรือ push schema
npx prisma db push
```

**Option B: ใช้ Local (ถ้าไม่มี Vercel CLI)**
```bash
# 1. Set DATABASE_URL locally
export DATABASE_URL="your-production-database-url"

# Windows PowerShell:
$env:DATABASE_URL="your-production-database-url"

# 2. Run migrations
npx prisma db push

# 3. (Optional) Seed data
npm run db:seed
```

#### 5.3 Verify Database

```bash
# 1. ไปที่ production URL
https://uppowerskill-lms-xxx.vercel.app

# 2. ลองเข้าหน้า login
https://uppowerskill-lms-xxx.vercel.app/login

# 3. ลองสร้าง account ใหม่
# หรือใช้ test account:
# Email: admin@skillnexus.com
# Password: Admin@123!
```

---

## ✅ Verification Checklist

### ตรวจสอบว่า Deploy สำเร็จ

- [ ] เว็บไซต์เปิดได้ (ไม่มี 500 error)
- [ ] หน้า login แสดงผลถูกต้อง
- [ ] สามารถ login ได้
- [ ] Dashboard แสดงผลถูกต้อง
- [ ] ไม่มี error ใน Console (F12)
- [ ] Database connection ทำงาน

### ทดสอบฟีเจอร์หลัก

- [ ] สร้าง account ใหม่ได้
- [ ] Login/Logout ทำงาน
- [ ] ดู courses ได้
- [ ] Enroll course ได้
- [ ] เล่น video ได้
- [ ] ทำ quiz ได้

---

## 🎉 สำเร็จ!

ยินดีด้วย! SkillNexus LMS ของคุณ deploy สำเร็จแล้ว! 🚀

**URL ของคุณ**: https://uppowerskill-lms-xxx.vercel.app

---

## 🔧 ขั้นตอนถัดไป

### 1. Custom Domain (Optional)

```bash
# ใน Vercel Dashboard
1. ไปที่ Settings > Domains
2. Add your domain
3. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

4. รอ DNS propagation (5-30 นาที)
5. Vercel จะ auto-provision SSL
```

### 2. Setup Admin Account

```bash
# 1. ไปที่ production URL
# 2. Register account ใหม่
# 3. Update role ใน database:

# ใช้ Prisma Studio:
npx prisma studio

# หรือ SQL:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 3. Configure Features

```bash
# ใน Vercel Dashboard > Environment Variables

# Optional: Redis (for caching)
REDIS_URL = redis://...

# Optional: Stripe (for payments)
STRIPE_SECRET_KEY = sk_live_...
STRIPE_PUBLISHABLE_KEY = pk_live_...

# Optional: AWS S3 (for file storage)
AWS_ACCESS_KEY_ID = ...
AWS_SECRET_ACCESS_KEY = ...
AWS_REGION = ap-southeast-1
AWS_S3_BUCKET = ...

# หลังจากเพิ่ม env vars:
# Redeploy โปรเจค
```

### 4. Setup Monitoring

```bash
# ใน Vercel Dashboard
1. ไปที่ Analytics tab
2. Enable Analytics
3. ดู real-time metrics

# Setup Alerts:
1. ไปที่ Settings > Notifications
2. Add email for alerts
3. Configure alert thresholds
```

---

## 🆘 Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. Build Failed

**Error**: "Cannot find module '@prisma/client'"

**แก้ไข**:
```bash
# ใน Vercel Dashboard > Settings > General
# Build Command: prisma generate && next build
```

#### 2. Database Connection Error

**Error**: "Can't reach database server"

**แก้ไข**:
```bash
# ตรวจสอบ DATABASE_URL:
1. ถูกต้องหรือไม่
2. มี ?sslmode=require หรือไม่ (สำหรับ PostgreSQL)
3. Database ทำงานอยู่หรือไม่

# Test connection:
npx prisma db pull
```

#### 3. Authentication Error

**Error**: "NEXTAUTH_URL is not set"

**แก้ไข**:
```bash
# ใน Vercel Dashboard > Settings > Environment Variables
# เพิ่ม:
NEXTAUTH_URL = https://your-project.vercel.app
AUTH_URL = https://your-project.vercel.app

# Redeploy
```

#### 4. 500 Internal Server Error

**แก้ไข**:
```bash
# 1. ดู error logs:
# Vercel Dashboard > Logs

# 2. Common causes:
- Database not connected
- Missing environment variables
- Prisma client not generated

# 3. Quick fix:
# Redeploy with correct env vars
```

---

## 📚 เอกสารเพิ่มเติม

### คู่มือที่สำคัญ

1. **KIRO-PROJECT-ANALYSIS.md**
   - วิเคราะห์โปรเจคแบบละเอียด
   - จุดแข็ง/จุดอ่อน
   - Roadmap

2. **KIRO-DEPLOYMENT-PLAN.md**
   - แผนการ deploy แบบละเอียด
   - Database options
   - Troubleshooting

3. **KIRO-MAINTENANCE-GUIDE.md**
   - การบำรุงรักษาระบบ
   - Daily/Weekly/Monthly tasks
   - Emergency procedures

4. **DEPLOYMENT-CHECKLIST.md**
   - Checklist สำหรับ production
   - Environment variables
   - Testing procedures

### เอกสารเดิม

- **README.md** - ภาพรวมโปรเจค
- **PROJECT-STATUS.md** - สถานะปัจจุบัน
- **QUICK-DEPLOY.md** - คู่มือ deploy แบบย่อ
- **TROUBLESHOOTING-DATABASE.md** - แก้ปัญหา database

---

## 💡 Tips & Best Practices

### Performance

```bash
# 1. Enable caching
- Setup Redis
- Use CDN for static assets
- Enable ISR for static pages

# 2. Optimize images
- Use Next.js Image component
- Convert to WebP/AVIF
- Lazy loading

# 3. Monitor performance
- Vercel Analytics
- Lighthouse scores
- Real user monitoring
```

### Security

```bash
# 1. Keep secrets safe
- Never commit .env files
- Rotate secrets regularly
- Use strong passwords

# 2. Monitor security
- Check logs daily
- Setup alerts
- Regular security audits

# 3. Update dependencies
- npm audit weekly
- Update packages monthly
- Test after updates
```

### Backup

```bash
# 1. Database backups
- Automated daily backups
- Test restoration monthly
- Keep 30 days retention

# 2. Code backups
- GitHub is primary backup
- Tag releases
- Document changes
```

---

## 📞 ต้องการความช่วยเหลือ?

### Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs

### Support

- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: Create issue in repository
- **Community**: Discord/Slack channels

---

## 🎊 Congratulations!

คุณได้ deploy SkillNexus LMS สำเร็จแล้ว! 🚀

**Next Steps**:
1. ✅ Test all features
2. ✅ Setup monitoring
3. ✅ Configure custom domain
4. ✅ Add content
5. ✅ Invite users
6. ✅ Start learning!

---

**จัดทำโดย**: Kiro AI Assistant  
**วันที่**: 1 กุมภาพันธ์ 2026  
**เวอร์ชัน**: 1.0  
**สถานะ**: Ready to Deploy! 🚀
