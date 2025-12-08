# 🚀 ใช้ Vercel Postgres แทน

## Supabase ยังไม่พร้อม ใช้ Vercel Postgres:

### 1. ไปที่ Vercel Dashboard
```
https://vercel.com/dashboard
→ uppowerskill.com project  
→ Storage tab
→ Create Database → Postgres
```

### 2. หรือใช้ Database ที่มีอยู่
```
→ Storage tab
→ คลิก uppowerskill-db
→ Settings → General
→ Copy POSTGRES_URL (ไม่ใช่ PRISMA_URL)
```

### 3. อัพเดท Vercel Environment Variables
```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_URL=https://uppowerskill.com
AUTH_URL=https://uppowerskill.com
NEXT_PUBLIC_URL=https://uppowerskill.com
NODE_ENV=production
AUTH_TRUST_HOST=true
```

### 4. Redeploy
```
Deployments → Redeploy latest
```

## ✅ Vercel Postgres ดีกว่าเพราะ:
- เชื่อมต่อได้ทันที
- ไม่ต้อง setup เพิ่ม
- Integration กับ Vercel ดี