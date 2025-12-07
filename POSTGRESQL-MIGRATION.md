# 🐘 PostgreSQL Migration Guide

Complete guide to migrate SkillNexus LMS from SQLite to PostgreSQL.

## 🚀 Quick Setup (Automated)

### Windows
```bash
# Run the automated setup script
scripts\setup-postgresql.bat
```

### Linux/Mac
```bash
# Make script executable and run
chmod +x scripts/setup-postgresql.js
npm run db:setup-postgresql
```

## 📋 Manual Setup

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Use default settings (port 5432, user: postgres)

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE skillnexus;
CREATE USER skillnexus_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE skillnexus TO skillnexus_user;
\q
```

### 3. Update Environment Variables

Copy the PostgreSQL template:
```bash
cp .env.postgresql .env
```

Update your `.env` file:
```env
# Local Development
DATABASE_URL="postgresql://skillnexus_user:your_password@localhost:5432/skillnexus?schema=public"

# Or use default postgres user
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/skillnexus?schema=public"
```

### 4. Run Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data
npm run db:seed
```

## 🌐 Production Database Options

### 1. Vercel Postgres (Recommended for Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Create Postgres database
vercel postgres create skillnexus-db

# Get connection string
vercel env pull .env.local
```

**Environment:**
```env
DATABASE_URL="postgres://default:xxx@ep-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

### 2. Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings > Database

**Environment:**
```env
DATABASE_URL="postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres?schema=public"
```

### 3. Neon (Serverless PostgreSQL)

1. Go to https://neon.tech
2. Create new project
3. Copy connection string

**Environment:**
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 4. Railway (Full-Stack Platform)

1. Go to https://railway.app
2. Create new project with PostgreSQL
3. Get connection string from Variables tab

**Environment:**
```env
DATABASE_URL="postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway"
```

### 5. AWS RDS (Enterprise)

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Get endpoint and credentials

**Environment:**
```env
DATABASE_URL="postgresql://username:password@skillnexus.xxx.us-east-1.rds.amazonaws.com:5432/skillnexus"
```

## 🔧 Database Configuration

### Connection Pooling (Production)

Add to your environment:
```env
# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_POOL_TIMEOUT=30000

# Query Optimization
DATABASE_QUERY_TIMEOUT=30000
DATABASE_STATEMENT_TIMEOUT=60000
```

### Prisma Configuration

Update `prisma/schema.prisma` if needed:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```

## 📊 Performance Optimization

### 1. Database Indexes

Key indexes are automatically created by Prisma:
- User email (unique)
- Course enrollments
- Watch history
- Certificate verification

### 2. Query Optimization

```typescript
// Use connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

### 3. Caching Strategy

```typescript
// Redis caching for frequent queries
const redis = new Redis(process.env.REDIS_URL)

// Cache user sessions
await redis.setex(`user:${userId}`, 3600, JSON.stringify(user))
```

## 🔍 Troubleshooting

### Common Issues

**1. Connection Refused**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

**2. Authentication Failed**
```bash
# Reset postgres password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
```

**3. Database Does Not Exist**
```bash
# Create database
createdb skillnexus
```

**4. Permission Denied**
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE skillnexus TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

### Migration Errors

**1. Schema Conflicts**
```bash
# Reset database
npm run db:reset

# Push fresh schema
npm run db:push
```

**2. Data Type Issues**
- SQLite `INTEGER` → PostgreSQL `SERIAL` or `INTEGER`
- SQLite `TEXT` → PostgreSQL `TEXT` or `VARCHAR`
- SQLite `REAL` → PostgreSQL `DECIMAL` or `FLOAT`

## 🧪 Testing the Migration

### 1. Verify Connection
```bash
# Test database connection
npx prisma db pull
```

### 2. Check Data
```bash
# Open Prisma Studio
npx prisma studio
```

### 3. Run Application
```bash
# Start development server
npm run dev

# Test login with default accounts
# admin@skillnexus.com / Admin@123!
```

## 📈 Performance Monitoring

### Database Metrics
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('skillnexus'));

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Application Monitoring
```typescript
// Add to your API routes
console.time('database-query')
const result = await prisma.user.findMany()
console.timeEnd('database-query')
```

## 🔒 Security Best Practices

### 1. Connection Security
```env
# Always use SSL in production
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### 2. User Permissions
```sql
-- Create limited user for application
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE skillnexus TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### 3. Environment Variables
```bash
# Never commit credentials
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

## 🎯 Next Steps

After successful migration:

1. **Update CI/CD** - Update deployment scripts
2. **Monitor Performance** - Set up database monitoring
3. **Backup Strategy** - Implement regular backups
4. **Scaling** - Consider read replicas for high traffic
5. **Optimization** - Fine-tune queries and indexes

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
3. Test connection: `psql -h localhost -U postgres -d skillnexus`
4. Verify Prisma schema: `npx prisma validate`

---

**🎉 Congratulations! Your SkillNexus LMS is now running on PostgreSQL!**