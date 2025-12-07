# 🌱 Seed Production Database

## 🎯 Quick Fix for uppowerskill.com Login

### Step 1: Add SEED_SECRET to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add new variable:
   ```
   Name: SEED_SECRET
   Value: uppowerskill-seed-2024
   ```
5. Click "Save"
6. Redeploy (or wait for auto-deploy)

### Step 2: Call Seed API

```bash
curl -X POST https://www.uppowerskill.com/api/seed-production \
  -H "Content-Type: application/json" \
  -d '{"secret":"uppowerskill-seed-2024"}'
```

**Or use browser console:**
```javascript
fetch('https://www.uppowerskill.com/api/seed-production', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ secret: 'uppowerskill-seed-2024' })
})
.then(r => r.json())
.then(console.log)
```

### Step 3: Test Login

Go to: https://www.uppowerskill.com/login

**Test Accounts:**
- admin@skillnexus.com / Admin@123!
- teacher@skillnexus.com / Admin@123!
- student@skillnexus.com / Admin@123!

---

## ⚠️ Important Notes

1. **Database Type**: Check if using SQLite or PostgreSQL
   - SQLite: Data lost on redeploy
   - PostgreSQL: Data persists (recommended)

2. **Environment Variables Required:**
   ```env
   DATABASE_URL=<your-database-url>
   NEXTAUTH_URL=https://www.uppowerskill.com
   NEXT_PUBLIC_URL=https://www.uppowerskill.com
   NEXTAUTH_SECRET=<production-secret>
   SEED_SECRET=uppowerskill-seed-2024
   ```

3. **Security**: Remove SEED_SECRET after seeding

---

## 🔄 Alternative: Use PostgreSQL (Recommended)

### Quick Setup:

1. **Create Database** (choose one):
   - Vercel Postgres: https://vercel.com/storage/postgres
   - Supabase: https://supabase.com (free tier)
   - Neon: https://neon.tech (free tier)

2. **Update Vercel Environment Variables:**
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   ```

3. **Run Migrations:**
   ```bash
   DATABASE_URL="your-url" npx prisma migrate deploy
   DATABASE_URL="your-url" npx prisma db seed
   ```

4. **Redeploy**

---

## 🐛 Troubleshooting

**"Unauthorized" error:**
→ SEED_SECRET ไม่ตรงกัน

**"Users already exist":**
→ Database มี users แล้ว, ลอง login ด้วย accounts ที่มี

**"Database connection failed":**
→ ตรวจสอบ DATABASE_URL ใน Vercel

**"Failed to seed users":**
→ ดู Vercel Function Logs สำหรับ error details

---

## ✅ Success Response

```json
{
  "success": true,
  "message": "Production users created",
  "users": [
    { "email": "admin@skillnexus.com", "role": "ADMIN" },
    { "email": "teacher@skillnexus.com", "role": "TEACHER" },
    { "email": "student@skillnexus.com", "role": "STUDENT" }
  ]
}
```

Now you can login! 🎉
