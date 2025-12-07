# 🐘 Quick PostgreSQL Setup

Switch SkillNexus LMS to PostgreSQL in 5 minutes.

## 🚀 Automated Setup

### Windows
```bash
scripts\setup-postgresql.bat
```

### Linux/Mac
```bash
npm run db:setup-postgresql
```

## 📋 Manual Setup

### 1. Install PostgreSQL
- **Windows**: https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt install postgresql`

### 2. Create Database
```bash
createdb skillnexus
```

### 3. Update Environment
```bash
cp .env.postgresql .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus?schema=public"
```

### 4. Run Migration
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start Application
```bash
npm run dev
```

## 🌐 Production Options

- **Vercel Postgres**: `vercel postgres create`
- **Supabase**: https://supabase.com (free tier)
- **Neon**: https://neon.tech (serverless)
- **Railway**: https://railway.app (full-stack)

## ✅ Test Accounts

- **Admin**: admin@skillnexus.com / Admin@123!
- **Student**: student@skillnexus.com / Student@123!

---

**🎉 Done! Your SkillNexus LMS is now running on PostgreSQL!**