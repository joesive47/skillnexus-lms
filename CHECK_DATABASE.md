# ตรวจสอบและแก้ไขปัญหา Database

## ปัญหาที่พบ

1. ✅ **Schema หลัก (schema.prisma)** - ใช้ PostgreSQL แล้ว
2. ❌ **มีไฟล์ SQLite เก่า** - `prisma/dev.db` และ `prisma/prisma/dev.db`
3. ⚠️ **Schema Extension ไม่ได้ใช้งาน** - มีไฟล์ schema-*.prisma หลายไฟล์ที่ไม่ได้ merge เข้า schema หลัก
4. ❌ **Prisma Client ถูกล็อค** - ไม่สามารถ generate ใหม่ได้

## วิธีแก้ไข

### วิธีที่ 1: ใช้ Batch Script (แนะนำ)

```bash
fix-database.bat
```

### วิธีที่ 2: แก้ไขด้วยตนเอง

1. **ลบไฟล์ SQLite เก่า**
   ```bash
   del /f /q prisma\dev.db
   del /f /q prisma\prisma\dev.db
   rmdir /s /q prisma\prisma
   ```

2. **ลบ Prisma Client เก่า**
   ```bash
   rmdir /s /q node_modules\.prisma
   rmdir /s /q node_modules\@prisma\client
   ```

3. **ติดตั้ง dependencies ใหม่**
   ```bash
   npm install
   ```

4. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

5. **Push schema ไปยัง PostgreSQL**
   ```bash
   npm run db:push
   ```

6. **Seed ข้อมูล (ถ้าต้องการ)**
   ```bash
   npm run db:seed
   ```

## ตรวจสอบว่า PostgreSQL ทำงานอยู่

ตรวจสอบว่า PostgreSQL กำลังทำงานที่ port 5433:

```bash
# ใช้ Docker
docker ps | findstr postgres

# หรือตรวจสอบ connection
npm run db:studio
```

## ไฟล์ที่ต้องตรวจสอบ

- ✅ `prisma/schema.prisma` - ใช้ PostgreSQL
- ✅ `.env` - DATABASE_URL ชี้ไปที่ PostgreSQL
- ✅ `src/lib/prisma.ts` - ใช้ PrismaClient ปกติ

## Schema Extension Files (ไม่ได้ใช้งาน)

ไฟล์เหล่านี้เป็น schema เสริมที่ยังไม่ได้ merge เข้า schema หลัก:
- `prisma/schema-advanced.prisma` - Note, Bookmark, StudySession, Flashcard
- `prisma/schema-ai.prisma` - AI Recommendations, Learning Paths
- `prisma/schema-extension.prisma` - Gamification (Badges, Points)
- `prisma/schema-social.prisma` - Discussion, Reply, Likes

**หมายเหตุ**: ถ้าต้องการใช้ features เหล่านี้ ต้อง merge models เข้าไปใน `schema.prisma` หลัก

## การตรวจสอบหลังแก้ไข

1. ตรวจสอบว่า Prisma Client generate สำเร็จ
2. ตรวจสอบว่าไม่มีไฟล์ .db เหลืออยู่
3. ทดสอบ connection ด้วย `npm run db:studio`
4. รัน development server `npm run dev`
