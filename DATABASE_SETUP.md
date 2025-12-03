# 🗄️ Database Setup Guide - SkillNexus LMS

## ปัญหาที่พบ
```
Error: The table `public.scorm_progress` does not exist in the current database.
```

## สาเหตุ
ตาราง `scorm_progress` ยังไม่ถูกสร้างในฐานข้อมูล PostgreSQL

## วิธีแก้ไข

### ขั้นตอนที่ 1: ตรวจสอบ PostgreSQL Server

**ตรวจสอบว่า PostgreSQL กำลังทำงานหรือไม่:**

```bash
# Windows (PowerShell)
Get-Service -Name postgresql*

# หรือเปิด Services (services.msc) และหา PostgreSQL
```

**ถ้ายังไม่ได้ติดตั้ง PostgreSQL:**
- ดาวน์โหลดจาก: https://www.postgresql.org/download/windows/
- หรือใช้ Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

### ขั้นตอนที่ 2: แก้ไข DATABASE_URL

แก้ไขไฟล์ `.env` ให้ตรงกับ PostgreSQL ของคุณ:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**ตัวอย่าง:**
```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/skillnexus?schema=public"

# Docker PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus?schema=public"

# Remote PostgreSQL
DATABASE_URL="postgresql://user:pass@192.168.1.100:5432/skillnexus?schema=public"
```

### ขั้นตอนที่ 3: สร้างฐานข้อมูล

**สร้างฐานข้อมูล `skillnexus`:**

```bash
# เข้า PostgreSQL
psql -U postgres

# สร้างฐานข้อมูล
CREATE DATABASE skillnexus;

# ออกจาก psql
\q
```

### ขั้นตอนที่ 4: Push Schema ไปยังฐานข้อมูล

```bash
# Generate Prisma Client
npm run db:generate

# Push schema (สร้างตารางทั้งหมด)
npm run db:push

# หรือใช้คำสั่งโดยตรง
npx prisma db push
```

### ขั้นตอนที่ 5: Seed ข้อมูลเริ่มต้น (Optional)

```bash
npm run db:seed
```

### ขั้นตอนที่ 6: Build และ Run

```bash
# Build
npm run build

# Run
npm run dev
```

## 🔧 คำสั่งที่เป็นประโยชน์

```bash
# ดู schema ปัจจุบัน
npx prisma db pull

# เปิด Prisma Studio (GUI)
npx prisma studio

# Reset database (ลบข้อมูลทั้งหมด)
npx prisma db push --force-reset

# สร้าง migration
npx prisma migrate dev --name init
```

## 🐳 ใช้ Docker PostgreSQL (แนะนำ)

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: skillnexus-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: skillnexus
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**เริ่มต้น:**
```bash
docker-compose up -d
```

**DATABASE_URL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus?schema=public"
```

## ✅ ตรวจสอบว่าแก้ไขสำเร็จ

```bash
# ตรวจสอบว่าตารางถูกสร้างแล้ว
npx prisma studio

# หรือใช้ psql
psql -U postgres -d skillnexus -c "\dt"
```

ควรเห็นตาราง `scorm_progress` ในรายการ

## 📝 หมายเหตุ

- ตาราง `scorm_progress` ใช้สำหรับเก็บความคืบหน้าของ SCORM packages
- Schema อยู่ที่: `prisma/schema.prisma`
- Model: `ScormProgress` มี relation กับ `User` และ `ScormPackage`

## 🆘 ถ้ายังมีปัญหา

1. ตรวจสอบ PostgreSQL logs
2. ตรวจสอบ firewall (port 5432)
3. ตรวจสอบ username/password ใน DATABASE_URL
4. ลอง reset database: `npx prisma db push --force-reset`
