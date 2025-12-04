# 🗄️ Production Database Setup Guide

## 📋 เลือก Production Database Provider

### 1️⃣ Vercel Postgres (แนะนำสำหรับ Vercel Deployment)

**ข้อดี:**
- ✅ Integration กับ Vercel สมบูรณ์แบบ
- ✅ Connection Pooling built-in
- ✅ Auto-scaling
- ✅ Setup ง่ายที่สุด

**ราคา:** $0.29/GB storage + $0.102/GB transfer

**Setup:**
```bash
# 1. ไปที่ Vercel Dashboard
# 2. เลือก Project > Storage > Create Database > Postgres
# 3. Copy DATABASE_URL จาก Environment Variables
# 4. Paste ใน .env.production
```

**Connection String Format:**
```
postgres://default:xxxxx@xxxxx-pooler.aws-region.postgres.vercel-storage.com:5432/verceldb?sslmode=require
```

---

### 2️⃣ Supabase (แนะนำสำหรับ Free Tier)

**ข้อดี:**
- ✅ Free tier: 500MB database
- ✅ Built-in Auth, Storage, Realtime
- ✅ Excellent dashboard
- ✅ Connection pooling (PgBouncer)

**ราคา:** Free (500MB) → $25/month (8GB)

**Setup:**
```bash
# 1. สร้าง Project ที่ https://supabase.com
# 2. ไปที่ Settings > Database
# 3. Copy Connection String (Transaction mode)
# 4. เปลี่ยน [YOUR-PASSWORD] เป็นรหัสผ่านของคุณ
```

**Connection String Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

---

### 3️⃣ Neon (แนะนำสำหรับ Serverless)

**ข้อดี:**
- ✅ Serverless Postgres
- ✅ Auto-scaling to zero
- ✅ Branching (Git-like for databases)
- ✅ Fast cold starts

**ราคา:** Free (0.5GB) → $19/month (10GB)

**Setup:**
```bash
# 1. สร้าง Project ที่ https://neon.tech
# 2. Copy Connection String
# 3. Paste ใน .env.production
```

**Connection String Format:**
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

---

### 4️⃣ Railway (แนะนำสำหรับ Full-Stack Deployment)

**ข้อดี:**
- ✅ Deploy database + app together
- ✅ Simple pricing
- ✅ Good performance
- ✅ Easy backups

**ราคา:** $5/month (1GB) → $20/month (8GB)

**Setup:**
```bash
# 1. สร้าง Project ที่ https://railway.app
# 2. Add PostgreSQL service
# 3. Copy DATABASE_URL
# 4. Paste ใน .env.production
```

---

### 5️⃣ AWS RDS (แนะนำสำหรับ Enterprise)

**ข้อดี:**
- ✅ Enterprise-grade reliability
- ✅ Full control
- ✅ Advanced features
- ✅ Multi-AZ deployment

**ราคา:** ~$15/month (db.t3.micro) → $100+/month (production)

**Setup:**
```bash
# 1. สร้าง RDS Instance ใน AWS Console
# 2. เลือก PostgreSQL engine
# 3. Configure security groups
# 4. Copy endpoint
```

**Connection String Format:**
```
postgresql://[username]:[password]@[endpoint].rds.amazonaws.com:5432/skillnexus?sslmode=require
```

---

## 🚀 Migration Steps

### Step 1: Backup Current Database (ถ้ามี)

```bash
# Export current data
npx prisma db pull
npx prisma db seed
```

### Step 2: Update Environment Variables

```bash
# Copy production template
cp .env.production .env

# Edit .env and update:
# 1. DATABASE_URL (from your provider)
# 2. NEXTAUTH_SECRET (generate new)
# 3. Other production values
```

### Step 3: Generate Prisma Client

```bash
# Generate Prisma client for production
npx prisma generate
```

### Step 4: Run Migrations

```bash
# Push schema to production database
npx prisma migrate deploy

# Or if first time
npx prisma db push
```

### Step 5: Seed Production Data (Optional)

```bash
# Seed initial data
npm run db:seed
```

### Step 6: Verify Connection

```bash
# Test database connection
npx prisma db pull
```

---

## 🔐 Security Best Practices

### 1. Generate Strong Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate AUTH_SECRET
openssl rand -base64 32

# Generate CERT_SIGNING_KEY
openssl rand -base64 32
```

### 2. Enable SSL/TLS

Always use `?sslmode=require` in production DATABASE_URL

### 3. Connection Pooling

**For Vercel/Serverless:**
```typescript
// Use connection pooling
DATABASE_URL="postgres://...?pgbouncer=true&connection_limit=1"
```

**For Prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}
```

### 4. Environment Variables

**Never commit `.env` to Git!**

Add to `.gitignore`:
```
.env
.env.local
.env.production
.env.*.local
```

---

## 📊 Performance Optimization

### 1. Connection Pool Settings

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. Query Optimization

```typescript
// Use select to reduce data transfer
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
  },
})

// Use indexes for frequently queried fields
@@index([email])
@@index([userId, courseId])
```

### 3. Caching Strategy

```typescript
// Use Redis for caching
import { redis } from '@/lib/redis'

const cacheKey = `user:${userId}`
const cached = await redis.get(cacheKey)

if (cached) return JSON.parse(cached)

const user = await prisma.user.findUnique({ where: { id: userId } })
await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600)
```

---

## 🔍 Monitoring & Maintenance

### 1. Database Monitoring

**Vercel Postgres:**
- Dashboard: https://vercel.com/dashboard/stores

**Supabase:**
- Dashboard: https://app.supabase.com/project/_/database

**Neon:**
- Dashboard: https://console.neon.tech

### 2. Backup Strategy

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### 3. Performance Monitoring

```typescript
// Add query logging
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"

**Solution:**
1. Check DATABASE_URL format
2. Verify SSL mode: `?sslmode=require`
3. Check firewall/security groups
4. Verify database is running

### Error: "Too many connections"

**Solution:**
1. Enable connection pooling
2. Use PgBouncer
3. Reduce connection_limit
4. Close unused connections

### Error: "Migration failed"

**Solution:**
```bash
# Reset migrations (CAUTION: Deletes data!)
npx prisma migrate reset

# Or manually fix
npx prisma db push --force-reset
```

---

## 📝 Checklist

- [ ] เลือก Database Provider
- [ ] สร้าง Production Database
- [ ] Copy DATABASE_URL
- [ ] Generate secrets (NEXTAUTH_SECRET, etc.)
- [ ] Update .env.production
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed data: `npm run db:seed`
- [ ] Test connection
- [ ] Enable SSL/TLS
- [ ] Setup connection pooling
- [ ] Configure backups
- [ ] Setup monitoring
- [ ] Add to .gitignore

---

## 🎯 Recommended Setup for SkillNexus

**For Development:**
- Local PostgreSQL or SQLite

**For Staging:**
- Supabase Free Tier

**For Production:**
- Vercel Postgres (if using Vercel)
- Neon (for serverless)
- AWS RDS (for enterprise)

---

**Need Help?** 
- Vercel: https://vercel.com/docs/storage/vercel-postgres
- Supabase: https://supabase.com/docs/guides/database
- Neon: https://neon.tech/docs/introduction
- Prisma: https://www.prisma.io/docs/guides/deployment
