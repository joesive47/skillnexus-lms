# ⚡ QUICK FIX - Database Connection Error

## 🔴 Error You're Seeing
```
Can't reach database server at `xxxxx-pooler.aws-region.postgres.vercel-storage.com:5432`
```

## ✅ Quick Solution (2 Options)

### Option 1: Use Local Database (Fastest - 2 minutes)

```bash
# 1. Update .env with local database
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus?schema=public"

# 2. Make sure PostgreSQL is running locally
# Windows: Check Services → PostgreSQL
# Mac: brew services start postgresql

# 3. Create database
createdb skillnexus

# 4. Run migrations
npx prisma generate
npx prisma db push
npm run db:seed

# 5. Start server
npm run dev
```

### Option 2: Use Supabase Free (5 minutes)

```bash
# 1. Go to https://supabase.com
# 2. Create New Project
# 3. Go to Settings → Database
# 4. Copy "Connection string" (Transaction mode)
# 5. Replace [YOUR-PASSWORD] with your actual password
# 6. Update .env:

DATABASE_URL="postgresql://postgres:YourActualPassword@db.abcdefghijklmnop.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# 7. Run migrations
npx prisma generate
npx prisma migrate deploy
npm run db:seed

# 8. Start server
npm run dev
```

## 📝 What Went Wrong?

Your `.env` file has a **placeholder URL** that doesn't point to a real database:
```
❌ postgres://default:xxxxx@xxxxx-pooler.aws-region...
```

You need a **real database URL** like:
```
✅ postgresql://postgres:realpassword@db.realproject.supabase.co:5432/postgres
```

## 🎯 Recommended: Start with Local Database

Edit `.env`:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus?schema=public"
```

Then run:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## 📚 Need More Help?

See detailed guide: `FIX-DATABASE-CONNECTION.md`
