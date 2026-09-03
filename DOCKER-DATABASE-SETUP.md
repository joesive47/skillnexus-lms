# 🐳 Docker Database Setup Guide

## 🚨 Quick Fix for Database Connection Error

### Problem
```
Can't reach database server at `localhost:5432`
```

### ✅ Solution (Choose One)

#### Option 1: Use Docker (Recommended)
```bash
# 1. Start Docker services
npm run docker:up

# 2. Wait for services to start (10 seconds)
# 3. Setup database
npm run docker:db

# 4. Start application
npm run dev
```

#### Option 2: Quick Docker Setup (Windows)
```bash
# Run the automated setup script
scripts\docker-setup.bat
```

#### Option 3: Manual Docker Setup
```bash
# 1. Copy Docker environment
copy .env.docker .env

# 2. Start PostgreSQL and Redis
docker-compose up -d postgres redis

# 3. Wait for services (check with)
docker-compose ps

# 4. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start app
npm run dev
```

## 🔧 Docker Commands

### Start Services
```bash
docker-compose up -d postgres redis
```

### Check Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Stop Services
```bash
docker-compose down
```

### Clean Everything
```bash
docker-compose down -v
docker system prune -f
```

## 📊 Database Connection Details

**Docker PostgreSQL:**
- Host: `localhost`
- Port: `5432`
- Database: `skillnexus`
- Username: `skillnexus`
- Password: `skillnexus123`
- URL: `postgresql://skillnexus:skillnexus123@localhost:5432/skillnexus`

**Docker Redis:**
- Host: `localhost`
- Port: `6379`
- URL: `redis://localhost:6379`

## 🚨 Troubleshooting

### 1. Port Already in Use
```bash
# Check what's using port 5432
netstat -ano | findstr :5432

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port in docker-compose.yml
ports:
  - "5433:5432"  # Use port 5433 instead
```

### 2. Docker Not Running
```bash
# Start Docker Desktop
# Then run:
docker info
```

### 3. Permission Issues
```bash
# Run as Administrator
# Or check Docker Desktop settings
```

### 4. Database Connection Test
```bash
# Test PostgreSQL connection
docker-compose exec postgres psql -U skillnexus -d skillnexus -c "SELECT version();"

# Test Redis connection
docker-compose exec redis redis-cli ping
```

## 🎯 Environment Files

### `.env` (Current - for Docker)
```env
DATABASE_URL="postgresql://skillnexus:skillnexus123@localhost:5432/skillnexus"
REDIS_URL="redis://localhost:6379"
```

### `.env.docker` (Template)
```env
DATABASE_URL="postgresql://skillnexus:skillnexus123@localhost:5432/skillnexus"
REDIS_URL="redis://localhost:6379"
# ... other settings
```

## 🚀 Quick Start Commands

```bash
# Full setup (one command)
npm run docker:full

# Or step by step
npm run docker:env     # Copy environment
npm run docker:up      # Start services
npm run docker:db      # Setup database
npm run dev           # Start app
```

## 📱 Application URLs

- **Application:** http://localhost:3000
- **Database Studio:** `npx prisma studio`
- **Health Check:** http://localhost:3000/api/health
- **Metrics:** http://localhost:3000/api/metrics

## 🔍 Verification

After setup, verify everything works:

1. **Database Connection:**
   ```bash
   npx prisma studio
   ```

2. **Application:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000
   ```

3. **Login Test:**
   - Email: `admin@skillnexus.com`
   - Password: `Admin@123!`

---

**🎉 Your SkillNexus LMS should now work perfectly with Docker! 🚀**