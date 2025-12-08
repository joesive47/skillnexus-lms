# 🔑 หารหัสผ่าน Supabase Database

## วิธีหารหัสผ่าน:

### Option 1: ใน Project Dashboard
1. ไปที่ Supabase Dashboard
2. เลือก Project ที่สร้าง
3. ไปที่ **Settings** (เมนูซ้าย)
4. คลิก **Database**
5. หา **Database password** หรือ **Connection parameters**

### Option 2: ใน API Settings
1. Settings → **API**
2. หา **Project API keys**
3. หรือ **Database URL** ที่มีรหัสผ่านแล้ว

### Option 3: Reset Password (ถ้าหาไม่เจอ)
1. Settings → **Database**
2. คลิก **Reset database password**
3. ใส่รหัสผ่านใหม่
4. Save

### Option 4: ใช้ Connection String ที่มีรหัสผ่านแล้ว
1. Settings → **Database**
2. หา **Connection string**
3. เลือก **URI** หรือ **Prisma**
4. Copy URL ที่มีรหัสผ่านแล้ว

## 🎯 หลังได้รหัสผ่านแล้ว:
```bash
# แทนที่ YOUR_PASSWORD ด้วยรหัสผ่านจริง
DATABASE_URL="postgresql://postgres:REAL_PASSWORD@db.mclvidycmdtpdrrzvglc.supabase.co:5432/postgres"
```