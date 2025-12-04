# 🗄️ Database Quick Reference

## 🚀 Quick Commands

### Switch to Production Database

**Windows:**
```bash
scripts\switch-to-production.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/switch-to-production.sh
./scripts/switch-to-production.sh
```

---

## 📋 Database Providers Comparison

| Provider | Free Tier | Price | Best For | Setup Time |
|----------|-----------|-------|----------|------------|
| **Vercel Postgres** | ❌ | $0.29/GB | Vercel apps | 2 min |
| **Supabase** | ✅ 500MB | $25/mo | Startups | 3 min |
| **Neon** | ✅ 0.5GB | $19/mo | Serverless | 2 min |
| **Railway** | ❌ | $5/mo | Full-stack | 3 min |
| **AWS RDS** | ❌ | $15+/mo | Enterprise | 10 min |

---

## 🔧 Common Tasks

### 1. Generate Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# AUTH_SECRET
openssl rand -base64 32

# CERT_SIGNING_KEY
openssl rand -base64 32
```

### 2. Update DATABASE_URL

**Vercel Postgres:**
```
postgres://default:xxxxx@xxxxx-pooler.aws-region.postgres.vercel-storage.com:5432/verceldb?sslmode=require
```

**Supabase:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

**Neon:**
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### 3. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Deploy migrations
npx prisma migrate deploy

# Or push schema (first time)
npx prisma db push

# Seed data
npm run db:seed
```

### 4. Verify Connection

```bash
# Test connection
npx prisma db pull

# Open Prisma Studio
npx prisma studio
```

---

## 🔐 Security Checklist

- [ ] Generate new NEXTAUTH_SECRET
- [ ] Generate new AUTH_SECRET
- [ ] Generate new CERT_SIGNING_KEY
- [ ] Use SSL/TLS (`?sslmode=require`)
- [ ] Enable connection pooling
- [ ] Add .env to .gitignore
- [ ] Never commit secrets to Git
- [ ] Use environment variables in hosting platform
- [ ] Setup database backups
- [ ] Enable monitoring

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"

**Fix:**
1. Check DATABASE_URL format
2. Add `?sslmode=require`
3. Verify database is running
4. Check firewall settings

### Error: "Too many connections"

**Fix:**
1. Add `?connection_limit=1`
2. Enable PgBouncer
3. Use connection pooling

### Error: "Migration failed"

**Fix:**
```bash
# Reset and retry
npx prisma migrate reset
npx prisma migrate deploy
```

---

## 📊 Performance Tips

### 1. Connection Pooling

```typescript
// Add to DATABASE_URL
?pgbouncer=true&connection_limit=1
```

### 2. Query Optimization

```typescript
// Use select to reduce data
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true }
})
```

### 3. Caching

```typescript
// Use Redis for caching
const cached = await redis.get(key)
if (cached) return JSON.parse(cached)
```

---

## 🎯 Recommended Setup

**Development:**
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus"
```

**Staging:**
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true"
```

**Production:**
```bash
DATABASE_URL="postgres://default:xxxxx@xxxxx-pooler.aws-region.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

---

## 📚 Resources

- [Full Setup Guide](./PRODUCTION-DATABASE-SETUP.md)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Docs](https://supabase.com/docs/guides/database)
- [Neon Docs](https://neon.tech/docs/introduction)
- [Prisma Docs](https://www.prisma.io/docs)

---

## 🔄 Quick Migration Workflow

```bash
# 1. Backup current database
npx prisma db pull

# 2. Update .env with production DATABASE_URL
cp .env.production .env

# 3. Generate Prisma Client
npx prisma generate

# 4. Deploy migrations
npx prisma migrate deploy

# 5. Seed data (optional)
npm run db:seed

# 6. Verify
npx prisma db pull
```

---

**Need Help?** Check [PRODUCTION-DATABASE-SETUP.md](./PRODUCTION-DATABASE-SETUP.md) for detailed guide.
