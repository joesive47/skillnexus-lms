# 🐳 Docker PostgreSQL Setup Guide

**วันที่**: 2 กุมภาพันธ์ 2026  
**เป้าหมาย**: เปลี่ยนจาก SQLite เป็น PostgreSQL ด้วย Docker

---

## 🎯 ข้อดีของ PostgreSQL + Docker

### ✅ ข้อดี:
1. **เหมือน Production**: ใช้ PostgreSQL เหมือน Vercel
2. **ไม่ต้องติดตั้ง**: ใช้ Docker container
3. **แยกข้อมูล**: ข้อมูล dev/prod แยกกัน
4. **Management Tools**: มี pgAdmin สำหรับจัดการ
5. **Backup ง่าย**: Docker volumes
6. **Team Development**: ทุกคนใช้ DB เดียวกัน

### ✅ เปรียบเทียบ:
| Feature | SQLite | PostgreSQL + Docker |
|---------|--------|-------------------|
| Setup | ง่าย | ง่าย (auto script) |
| Performance | เร็ว | เร็ว + scalable |
| Production Match | ❌ | ✅ |
| Concurrent Users | จำกัด | ไม่จำกัด |
| Advanced Features | จำกัด | ครบถ้วน |
| Management UI | ❌ | ✅ pgAdmin |

---

## 🚀 วิธีการติดตั้ง

### ขั้นตอนที่ 1: ติดตั้ง Docker Desktop

#### Windows:
1. ดาวน์โหลด: https://www.docker.com/products/docker-desktop
2. ติดตั้งและเปิด Docker Desktop
3. รอให้ Docker engine เริ่มทำงาน

#### ตรวจสอบการติดตั้ง:
```bash
docker --version
docker compose version
```

### ขั้นตอนที่ 2: รัน Auto Setup Script

```bash
# รัน script อัตโนมัติ
node setup-docker-postgres.js
```

**Script จะทำอะไร:**
1. ✅ ตรวจสอบ Docker
2. ✅ หยุด containers เก่า
3. ✅ เริ่ม PostgreSQL container
4. ✅ รอให้ database พร้อม
5. ✅ อัพเดท .env
6. ✅ แก้ไข Prisma schema
7. ✅ Generate Prisma client
8. ✅ Push database schema
9. ✅ Seed test data

### ขั้นตอนที่ 3: เริ่มใช้งาน

```bash
# เริ่ม Next.js app
npm run dev

# เปิดเว็บ
http://localhost:3000
```

---

## 📋 ไฟล์ที่สร้างขึ้น

### 1. `docker-compose.dev.yml`
- PostgreSQL container
- Redis container (optional)
- pgAdmin container (optional)

### 2. `.env.docker`
- Environment variables สำหรับ Docker
- PostgreSQL connection string

### 3. `scripts/init-db.sql`
- SQL script สำหรับ initialize database

### 4. `setup-docker-postgres.js`
- Auto setup script

---

## 🔗 Connection Details

### Database:
```
Host: localhost
Port: 5432
Database: skillnexus_dev
Username: skillnexus
Password: skillnexus123
URL: postgresql://skillnexus:skillnexus123@localhost:5432/skillnexus_dev
```

### pgAdmin (Database Management):
```
URL: http://localhost:5050
Email: admin@skillnexus.local
Password: admin123
```

### Redis (Optional):
```
Host: localhost
Port: 6379
URL: redis://localhost:6379
```

---

## 🛠️ Docker Commands

### เริ่ม Services:
```bash
# เริ่มทั้งหมด
docker compose -f docker-compose.dev.yml up -d

# เริ่มเฉพาะ PostgreSQL
docker compose -f docker-compose.dev.yml up -d postgres

# เริ่มพร้อม logs
docker compose -f docker-compose.dev.yml up postgres
```

### หยุด Services:
```bash
# หยุดทั้งหมด
docker compose -f docker-compose.dev.yml down

# หยุดและลบ volumes
docker compose -f docker-compose.dev.yml down -v
```

### ดู Logs:
```bash
# ดู logs ทั้งหมด
docker compose -f docker-compose.dev.yml logs

# ดู logs PostgreSQL
docker compose -f docker-compose.dev.yml logs postgres

# ดู logs แบบ real-time
docker compose -f docker-compose.dev.yml logs -f postgres
```

### เข้า Container:
```bash
# เข้า PostgreSQL container
docker compose -f docker-compose.dev.yml exec postgres bash

# เข้า psql
docker compose -f docker-compose.dev.yml exec postgres psql -U skillnexus -d skillnexus_dev
```

---

## 🔧 Troubleshooting

### ปัญหา: Port 5432 ถูกใช้อยู่
```bash
# ตรวจสอบ process ที่ใช้ port
netstat -ano | findstr :5432

# หยุด PostgreSQL service (ถ้ามี)
net stop postgresql-x64-15
```

### ปัญหา: Docker Desktop ไม่ทำงาน
```bash
# เริ่ม Docker Desktop
# หรือ restart Docker service
```

### ปัญหา: Container ไม่เริ่ม
```bash
# ดู logs
docker compose -f docker-compose.dev.yml logs postgres

# ลบ volumes และเริ่มใหม่
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d postgres
```

### ปัญหา: Connection refused
```bash
# รอให้ PostgreSQL พร้อม
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U skillnexus

# ตรวจสอบ health check
docker compose -f docker-compose.dev.yml ps
```

---

## 📊 การจัดการข้อมูล

### Backup Database:
```bash
# Backup ทั้ง database
docker compose -f docker-compose.dev.yml exec postgres pg_dump -U skillnexus skillnexus_dev > backup.sql

# Backup เฉพาะ schema
docker compose -f docker-compose.dev.yml exec postgres pg_dump -U skillnexus -s skillnexus_dev > schema.sql
```

### Restore Database:
```bash
# Restore จาก backup
docker compose -f docker-compose.dev.yml exec -T postgres psql -U skillnexus skillnexus_dev < backup.sql
```

### Reset Database:
```bash
# ลบข้อมูลทั้งหมด
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d postgres

# รอให้พร้อม แล้ว push schema ใหม่
npx prisma db push
node seed-test-data.js
```

---

## 🎯 การใช้งานหลัง Setup

### Development Workflow:
1. **เริ่มวัน**: `docker compose -f docker-compose.dev.yml up -d`
2. **พัฒนา**: `npm run dev`
3. **จบวัน**: `docker compose -f docker-compose.dev.yml stop`

### Database Changes:
1. **แก้ไข schema**: `prisma/schema.prisma`
2. **Push changes**: `npx prisma db push`
3. **Generate client**: `npx prisma generate`

### ดูข้อมูล:
1. **pgAdmin**: http://localhost:5050
2. **Prisma Studio**: `npx prisma studio`

---

## 🔄 การกลับไปใช้ SQLite

### ถ้าต้องการกลับไปใช้ SQLite:
```bash
# 1. หยุด Docker containers
docker compose -f docker-compose.dev.yml down

# 2. คืนค่า .env
cp .env.backup .env

# 3. แก้ไข Prisma schema
# เปลี่ยน provider = "postgresql" เป็น "sqlite"

# 4. Generate client ใหม่
npx prisma generate
npx prisma db push
```

---

## 📝 Test Accounts (หลัง Setup)

### Admin:
```
Email: admin@example.com
Password: admin123456
Role: ADMIN
Credits: 1000
```

### Teacher:
```
Email: teacher@example.com
Password: teacher123456
Role: TEACHER
Credits: 500
```

### Student:
```
Email: student@example.com
Password: student123456
Role: STUDENT
Credits: 100
```

---

## 🎉 สรุป

### ✅ หลัง Setup จะได้:
- PostgreSQL database (เหมือน production)
- pgAdmin สำหรับจัดการ database
- Redis สำหรับ caching (optional)
- Test data พร้อมใช้
- Environment ที่ใกล้เคียง production

### 🚀 พร้อมใช้งาน:
- Development environment ที่แข็งแรง
- Database management tools
- Backup/restore ง่าย
- Team development friendly

---

**พร้อมเริ่มติดตั้งไหมครับ?** 🐳

**จัดทำโดย**: Kiro AI Assistant  
**วันที่**: 2 กุมภาพันธ์ 2026