# 🚀 แก้ไข Database ใน 2 นาที

## วิธีที่ 1: Supabase (แนะนำ - ฟรี)

1. **สมัคร Supabase**
   - ไป https://supabase.com
   - สมัครด้วย GitHub/Google
   - สร้าง Project ใหม่

2. **คัดลอก Database URL**
   ```
   Settings → Database → Connection string → URI
   ```

3. **อัพเดท .env**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

4. **รัน Migration**
   ```bash
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

## วิธีที่ 2: Neon (ทางเลือก - ฟรี)

1. **สมัคร Neon**
   - ไป https://neon.tech
   - สมัครฟรี

2. **คัดลอก Connection String**

3. **อัพเดท .env**
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
   ```

## ✅ ทดสอบ
```bash
npx prisma db push
```

**เลือกวิธีที่ชอบและทำตาม 4 ขั้นตอน = เสร็จ!**