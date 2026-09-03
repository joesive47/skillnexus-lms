# 📋 Deployment Checklist - ตรวจสอบก่อน Deploy

## ✅ สิ่งที่ต้องเตรียม

### 1. GitHub Repository
- [x] Repository: joesive47@gmail.com
- [ ] Push code ไปยัง main branch
- [ ] ตั้งค่า GitHub Secrets (ถ้าใช้ GitHub Actions)

### 2. Vercel Account
- [x] เชื่อมต่อกับ Vercel.com แล้ว
- [ ] Import project จาก GitHub
- [ ] ตั้งค่า Environment Variables

### 3. Database (PostgreSQL)
- [x] ใช้ Vercel Postgres หรือ External PostgreSQL
- [x] DATABASE_URL พร้อมใช้งาน
- [ ] Run migrations: `npx prisma db push`
- [ ] Seed data (ถ้าต้องการ): `npm run db:seed`

## 🔧 Environment Variables ที่ต้องตั้งใน Vercel

### Required (จำเป็น)
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.vercel.app"
AUTH_SECRET="same-as-nextauth-secret"
AUTH_URL="https://your-domain.vercel.app"
AUTH_TRUST_HOST="true"
NODE_ENV="production"
```

### Optional (ถ้ามี)
```bash
# Redis (สำหรับ caching)
REDIS_URL="redis://..."

# Stripe (สำหรับ payment)
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."

# AWS S3 (สำหรับ file upload)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-southeast-1"
AWS_S3_BUCKET="..."

# Email (Resend)
RESEND_API_KEY="re_..."
```

## 🚀 ขั้นตอนการ Deploy

### วิธีที่ 1: Auto-Deploy ผ่าน GitHub (แนะนำ)

1. **ตรวจสอบระบบ**
   ```bash
   node pre-deploy-check.js
   ```

2. **Commit และ Push**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

3. **Vercel จะ auto-deploy อัตโนมัติ**
   - ดูสถานะได้ที่ Vercel Dashboard
   - หรือ GitHub Actions (ถ้าตั้งค่าไว้)

### วิธีที่ 2: Manual Deploy ผ่าน Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔍 ตรวจสอบหลัง Deploy

### 1. ตรวจสอบ Build Logs
- เข้า Vercel Dashboard → Deployments
- ดู Build Logs ว่ามี error หรือไม่

### 2. ตรวจสอบ Database
```bash
# ตรวจสอบว่า tables ถูกสร้างแล้ว
npx prisma studio
```

### 3. ทดสอบ Features หลัก
- [ ] Login/Register
- [ ] Course enrollment
- [ ] Video playback
- [ ] Quiz submission
- [ ] Certificate generation
- [ ] SCORM packages

### 4. ตรวจสอบ Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No console errors

## 🐛 Troubleshooting

### Build Failed
```bash
# ลองสร้าง local ก่อน
npm run build

# ถ้า error ที่ Prisma
npx prisma generate
npm run build
```

### Database Connection Error
```bash
# ตรวจสอบ DATABASE_URL
echo $DATABASE_URL

# ทดสอบ connection
npx prisma db push
```

### Environment Variables ไม่ทำงาน
1. ตรวจสอบใน Vercel Dashboard → Settings → Environment Variables
2. ต้อง Redeploy หลังเปลี่ยน env vars
3. ตรวจสอบว่าใช้ชื่อตัวแปรถูกต้อง

## 📊 Monitoring

### Vercel Analytics
- เปิดใช้งาน Analytics ใน Vercel Dashboard
- ดู Real-time visitors
- ตรวจสอบ Performance metrics

### Error Tracking
- ดู Runtime Logs ใน Vercel
- ตั้งค่า Sentry (optional)

## 🔐 Security Checklist

- [ ] NEXTAUTH_SECRET เป็น random string
- [ ] ไม่มี .env ใน Git
- [ ] API routes มี rate limiting
- [ ] Database credentials ปลอดภัย
- [ ] CORS ตั้งค่าถูกต้อง

## 📝 Post-Deployment

1. **Update DNS** (ถ้าใช้ custom domain)
2. **Setup SSL** (Vercel จัดการให้อัตโนมัติ)
3. **Configure CDN** (Vercel มี built-in CDN)
4. **Backup Database** (ตั้งค่า automated backup)

## 🎯 Performance Optimization

- [ ] Enable Vercel Edge Functions
- [ ] Configure ISR (Incremental Static Regeneration)
- [ ] Optimize images (Next.js Image component)
- [ ] Enable compression
- [ ] Setup Redis caching

## 📞 Support

หากพบปัญหา:
1. ตรวจสอบ Vercel Logs
2. ดู GitHub Issues
3. ติดต่อ Vercel Support

---

**สถานะปัจจุบัน:**
- ✅ Code พร้อม deploy
- ✅ GitHub connected
- ✅ Vercel connected
- ⏳ รอ push to GitHub และ auto-deploy

**ขั้นตอนถัดไป:**
```bash
node pre-deploy-check.js
git add .
git commit -m "Production ready"
git push origin main
```
