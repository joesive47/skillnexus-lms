# 🔧 Fix Database Connection

## ปัญหา: DATABASE_URL หมดอายุ

Error: `FATAL: Tenant or user not found`

---

## ✅ วิธีแก้ (2 นาที):

### 1. ไปที่ Vercel Dashboard
```
https://vercel.com/joesive47/skillnexus-lms/settings/environment-variables
```

### 2. Copy DATABASE_URL จาก Production
- คลิก "Reveal" ที่ `DATABASE_URL`
- Copy ค่าทั้งหมด

### 3. แก้ไขไฟล์ .env
เปิดไฟล์ `.env` แล้วแทนที่บรรทัดนี้:

```env
DATABASE_URL="paste-production-url-here"
```

### 4. รันคำสั่ง:
```powershell
# Push schema
npx prisma db push

# Seed 5 courses
npm run deploy:quick
```

---

## 🎯 หรือใช้ Vercel CLI (แนะนำ):

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env.production.local

# Use production env
$env:DATABASE_URL = (Get-Content .env.production.local | Select-String "DATABASE_URL").ToString().Split("=")[1].Trim('"')

# Deploy
npm run deploy:quick
```

---

## 📊 หลัง Deploy สำเร็จ:

จะได้:
- ✅ 5 หลักสูตร SCORM 2004
- ✅ 60 บทเรียน
- ✅ 3 Test Accounts

---

**Copy DATABASE_URL จาก Vercel แล้วรันใหม่ครับ! 🚀**
