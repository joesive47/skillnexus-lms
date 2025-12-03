# 🚀 LAUNCH NOW - upPowerSkill.com

## ⚡ 5-Step Launch (30 minutes)

### 1️⃣ Import Knowledge Base (NOW!)
```bash
# Copy file from Downloads
copy "%USERPROFILE%\Downloads\knowledge-base-1763982823686.json" knowledge-base.json

# Import to database
npm run import:knowledge
```

### 2️⃣ Setup Production Environment
```bash
# Copy template
copy .env.production .env

# Generate secret (Git Bash or WSL)
openssl rand -base64 32

# Or use online: https://generate-secret.vercel.app/32
```

**Update .env with:**
- `NEXTAUTH_SECRET` = (generated secret)
- `DATABASE_URL` = (Google Cloud SQL connection)
- `OPENAI_API_KEY` = (your OpenAI key)
- `REDIS_URL` = (Google Memorystore)

### 3️⃣ Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema
npm run db:push

# Seed data
npm run db:seed
```

### 4️⃣ Build & Test
```bash
# Build
npm run build

# Start production server
npm start

# Test in browser: http://localhost:3000
```

### 5️⃣ Deploy to Google Cloud
```bash
# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Deploy!
npm run gcloud:deploy

# Watch logs
npm run gcloud:logs
```

## ✅ Quick Verification

After deployment, test these URLs:

1. **Homepage**: https://uppowerskill.com
2. **Health Check**: https://uppowerskill.com/api/health
3. **Metrics**: https://uppowerskill.com/api/metrics
4. **Login**: https://uppowerskill.com/login
5. **Landing**: https://uppowerskill.com/landing

## 🎯 Expected Results

```json
// /api/health
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2025-01-24T..."
}

// /api/metrics
{
  "requests": { "total": 0, "success": 0, "errors": 0 },
  "performance": { "avgResponseTime": 0, "p95ResponseTime": 0 },
  "cache": { "hits": 0, "misses": 0, "hitRate": 0 },
  "health": { "score": 100, "status": "healthy" }
}
```

## 🆘 Troubleshooting

### Knowledge Base Import Failed
```bash
# Check file exists
dir knowledge-base.json

# Check database connection
npm run db:generate
```

### Build Failed
```bash
# Clear cache
rmdir /s /q .next
npm run build
```

### Deploy Failed
```bash
# Check Google Cloud auth
gcloud auth list

# Check project
gcloud config get-value project

# Re-deploy
npm run gcloud:deploy
```

## 📞 Support

- **Email**: support@uppowerskill.com
- **Admin**: admin@uppowerskill.com
- **Docs**: /PRODUCTION_DEPLOY.md

---

**YOU'RE READY TO LAUNCH! 🎉**

Just run these 3 commands:
```bash
npm run import:knowledge
npm run build
npm run gcloud:deploy
```

**GO LIVE! 🚀**
