# 🚂 Railway Deployment Guide

## Step 1: Push to GitHub (ถ้ายังไม่ได้ทำ)
```powershell
git init
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/The-SkillNexus.git
git push -u origin main
```

## Step 2: Deploy to Railway

### 2.1 ไปที่ Railway
https://railway.app

### 2.2 Login with GitHub
คลิก "Login with GitHub"

### 2.3 Create New Project
1. คลิก "New Project"
2. เลือก "Deploy from GitHub repo"
3. เลือก "The-SkillNexus"
4. คลิก "Deploy Now"

### 2.4 Add PostgreSQL Database
1. คลิก "+ New"
2. เลือก "Database" → "PostgreSQL"
3. Railway จะสร้าง DB และ set `DATABASE_URL` อัตโนมัติ

### 2.5 Add Environment Variables
ไปที่ **Variables** tab เพิ่ม:

```
NODE_ENV=production
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
PORT=3000
```

Optional (ถ้าต้องการ):
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=ap-southeast-1
```

### 2.6 Generate NEXTAUTH_SECRET
```powershell
# Windows PowerShell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### 2.7 Run Database Migration
ใน Railway Dashboard:
1. ไปที่ **Settings** → **Deploy**
2. เพิ่ม **Custom Start Command**:
```
npm run db:push && npm run db:seed && npm start
```

## Step 3: Deploy!
Railway จะ deploy อัตโนมัติ

## Step 4: Get Your URL
Railway จะให้ URL แบบ: `https://skillnexus-lms-production.up.railway.app`

## ✅ Done!

## 💰 Pricing
- **Free**: $5 credit/month
- **Hobby**: $5/month (500 hours)
- **Pro**: $20/month (unlimited)

## 🔧 Troubleshooting

### Build Failed?
ตรวจสอบ logs ใน Railway Dashboard

### Database Connection Error?
ตรวจสอบว่า `DATABASE_URL` ถูก set อัตโนมัติแล้ว

### Need Redis?
1. คลิก "+ New"
2. เลือก "Database" → "Redis"
3. Railway จะ set `REDIS_URL` อัตโนมัติ

## 🚀 Auto Deploy
ทุกครั้งที่ push ไป GitHub, Railway จะ deploy อัตโนมัติ!

```powershell
git add .
git commit -m "Update features"
git push
```

Railway จะ deploy ใหม่ทันที! 🎉
