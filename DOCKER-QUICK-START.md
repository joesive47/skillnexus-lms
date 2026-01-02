# 🐳 Docker Quick Start Guide

## เริ่มต้นใช้งาน Docker ใน 5 นาที

### 📋 ข้อกำหนดระบบ
- Docker Desktop (Windows/Mac) หรือ Docker Engine (Linux)
- Docker Compose
- RAM อย่างน้อย 4GB
- พื้นที่ว่าง 2GB

### 🚀 เริ่มต้นอย่างรวดเร็ว

#### Windows:
```bash
# 1. รัน Docker setup
scripts\docker-setup.bat start

# 2. เข้าใช้งาน
http://localhost:3000
```

#### Linux/Mac:
```bash
# 1. ให้สิทธิ์ script
chmod +x scripts/docker-setup.sh

# 2. รัน Docker setup
./scripts/docker-setup.sh start

# 3. เข้าใช้งาน
http://localhost:3000
```

### 🎯 คำสั่งที่ใช้บ่อย

```bash
# เริ่มต้นระบบ
docker-compose up -d

# หยุดระบบ
docker-compose down

# ดู logs
docker-compose logs -f

# ดูสถานะ
docker-compose ps

# รีสตาร์ท
docker-compose restart

# ล้างข้อมูล
docker-compose down -v
```

### 🔧 การตั้งค่า Environment

แก้ไขไฟล์ `.env`:
```env
# Database
DATABASE_URL="postgresql://skillnexus:skillnexus123@postgres:5432/skillnexus"

# Redis
REDIS_URL="redis://redis:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 🌐 URLs และ Ports

| Service | URL | Port |
|---------|-----|------|
| SkillNexus LMS | http://localhost:3000 | 3000 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |

### 👥 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillnexus.com | Admin@123! |
| Teacher | teacher@skillnexus.com | Teacher@123! |
| Student | student@skillnexus.com | Student@123! |

### 🔍 Troubleshooting

#### ปัญหาที่พบบ่อย:

**1. Port ถูกใช้งานแล้ว**
```bash
# เช็ค port ที่ใช้งาน
netstat -an | findstr :3000

# เปลี่ยน port ใน docker-compose.yml
ports:
  - "3001:3000"  # เปลี่ยนจาก 3000 เป็น 3001
```

**2. Database connection error**
```bash
# รอให้ PostgreSQL พร้อม
docker-compose exec postgres pg_isready -U skillnexus

# รัน migration ใหม่
docker-compose exec app npx prisma migrate deploy
```

**3. Memory issues**
```bash
# เพิ่ม memory limit ใน docker-compose.yml
services:
  app:
    mem_limit: 1g
```

### 📊 Development vs Production

#### Development (Hot Reload):
```bash
# ใช้ development compose
docker-compose -f docker-compose.dev.yml up -d

# URL: http://localhost:3001
```

#### Production:
```bash
# ใช้ production compose
docker-compose up -d

# URL: http://localhost:3000
```

### 🔄 Database Management

```bash
# Backup database
docker-compose exec postgres pg_dump -U skillnexus skillnexus > backup.sql

# Restore database
docker-compose exec -T postgres psql -U skillnexus skillnexus < backup.sql

# Reset database
docker-compose down -v
docker-compose up -d
./scripts/docker-setup.sh start
```

### 📈 Performance Monitoring

```bash
# ดู resource usage
docker stats

# ดู logs แบบ real-time
docker-compose logs -f app

# เช็ค health status
curl http://localhost:3000/api/health
```

### 🚀 Next Steps

1. **ทดสอบระบบ**: เข้าใช้งานด้วย test accounts
2. **ปรับแต่ง**: แก้ไข environment variables
3. **Deploy**: ใช้ production setup สำหรับ deployment
4. **Monitor**: ติดตาม performance และ logs

---

**🎉 SkillNexus LMS พร้อมใช้งานแล้ว!**

สำหรับคำถามเพิ่มเติม ดูที่ [DEPLOYMENT.md](./DEPLOYMENT.md)