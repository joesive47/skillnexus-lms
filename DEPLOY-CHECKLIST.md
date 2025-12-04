# ✅ Deployment Checklist

## 🎯 Pre-Deployment

### 1. Code Ready
- [x] Local development working
- [x] All features tested
- [x] No console errors
- [x] Build successful: `npm run build`

### 2. Database Ready
- [ ] Production database created (Vercel Postgres/Supabase/Neon)
- [ ] DATABASE_URL obtained
- [ ] Connection tested

### 3. Secrets Generated
Run: `node scripts/generate-secrets.js`

Generated Secrets:
```
NEXTAUTH_SECRET=Rmi2F8HIWcXQvxmoCOxOfIQsmCLDMPrDy2hrSKDl8lo=
AUTH_SECRET=tch63q5u0+UQ0Yc90XFc5mYQOx+3hTOhljCF1dIGO6c=
CERT_SIGNING_KEY=+wz/h8Lz2Cx6l03q3J4zEDjPh8Plm5SyGlJkhPk5a08=
```

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/new
2. Import GitHub repository
3. Click "Deploy"

### Step 3: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=your_database_url_here
NEXTAUTH_SECRET=Rmi2F8HIWcXQvxmoCOxOfIQsmCLDMPrDy2hrSKDl8lo=
AUTH_SECRET=tch63q5u0+UQ0Yc90XFc5mYQOx+3hTOhljCF1dIGO6c=
NEXTAUTH_URL=https://your-app.vercel.app
AUTH_URL=https://your-app.vercel.app
AUTH_TRUST_HOST=true
NODE_ENV=production
NEXT_PUBLIC_URL=https://your-app.vercel.app
CERT_SIGNING_KEY=+wz/h8Lz2Cx6l03q3J4zEDjPh8Plm5SyGlJkhPk5a08=
RAG_CHUNK_SIZE=600
RAG_CHUNK_OVERLAP=50
RAG_MAX_RESULTS=3
RAG_BATCH_SIZE=10
RAG_MAX_CONCURRENT=5
RAG_CACHE_SIZE=2000
RAG_ENABLE_PRELOAD=true
RAG_FAST_MODE=true
RAG_SIMILARITY_THRESHOLD=0.25
```

### Step 4: Run Database Migrations
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### Step 5: Redeploy
```bash
vercel --prod
```

---

## ✅ Post-Deployment

### Verify Deployment
- [ ] Site loads: https://your-app.vercel.app
- [ ] Login works
- [ ] Database connected
- [ ] Admin dashboard accessible
- [ ] Student enrollment works
- [ ] Video playback works
- [ ] Quiz functionality works

### Test Accounts
- Admin: admin@skillnexus.com / Admin@123!
- Teacher: teacher@skillnexus.com / Teacher@123!
- Student: student@skillnexus.com / Student@123!

---

## 🔧 Optional Configuration

### Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records

### SSL Certificate
- Automatically provided by Vercel

### Monitoring
1. Vercel Dashboard → Analytics
2. Enable Web Analytics
3. Setup error tracking

---

## 📊 Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Setup Redis (Upstash)
- [ ] Configure CDN
- [ ] Enable caching
- [ ] Setup monitoring alerts

---

## 🆘 Troubleshooting

### Build Failed
Check: Vercel Dashboard → Deployments → Build Logs

### Database Connection Error
Verify: DATABASE_URL format and SSL mode

### 500 Error
Check: Function Logs in Vercel Dashboard

---

## 🎉 Deployment Complete!

Your SkillNexus LMS is now live at: https://your-app.vercel.app

**Next Steps:**
1. Test all features
2. Setup monitoring
3. Configure backups
4. Add custom domain
5. Enable analytics
