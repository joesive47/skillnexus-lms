# 🗄️ Get Database URL from Vercel

## ขั้นตอนดึง DATABASE_URL

### 1. ไปที่ Vercel Dashboard
1. เข้า https://vercel.com/dashboard
2. เลือก project uppowerskill.com
3. ไปที่ **Storage** tab
4. คลิก **uppowerskill-db**
5. ไปที่ **Settings** → **General**
6. Copy **DATABASE_URL**

### 2. เพิ่ม Environment Variable
1. ไปที่ **Settings** → **Environment Variables**
2. เพิ่ม `DATABASE_URL` = `postgresql://...` (ที่ copy มา)
3. เลือก **Production** environment
4. คลิก **Save**

### 3. Setup Database Schema
```bash
# Connect to production database
npx prisma migrate deploy

# Seed with initial data
npx prisma db seed
```

### 4. Verify Connection
```bash
# Test connection
npx prisma studio
```

## 🚀 Quick Commands

```bash
# If you have Vercel CLI
vercel env ls
vercel env add DATABASE_URL

# Manual setup
# Copy DATABASE_URL from Vercel Dashboard
# Add to Environment Variables
# Redeploy
```