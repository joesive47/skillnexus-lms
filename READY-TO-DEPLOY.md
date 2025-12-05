# ✅ READY TO DEPLOY - Google Cloud Run

## 📋 Configuration

- **Project ID:** `skillnexus-lms-2025`
- **Account:** `joesive@gmail.com`
- **Database:** Supabase (sorvxmipetkhofhhqjio)
- **Region:** asia-southeast1

---

## 🚀 Deploy Now! (Copy-Paste Commands)

### 1. Open Cloud Shell
```
https://console.cloud.google.com
```
- Login: joesive@gmail.com
- Click "Activate Cloud Shell" (top right)

### 2. Set Project
```bash
gcloud config set project skillnexus-lms-2025
```

### 3. Enable APIs
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### 4. Clone & Deploy
```bash
git clone https://github.com/YOUR_USERNAME/The-SkillNexus.git
cd The-SkillNexus

gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --max-instances=10 \
  --min-instances=0
```

**รอ 3-5 นาที** ☕

---

## 🔑 Environment Variables

### Add in Cloud Run Console:

1. Go to: https://console.cloud.google.com/run
2. Click: `skillnexus-lms`
3. Click: "EDIT & DEPLOY NEW REVISION"
4. Tab: "Variables & Secrets"
5. Add these variables:

```bash
DATABASE_URL
postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres

NEXTAUTH_SECRET
hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=

AUTH_SECRET
hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=

NEXTAUTH_URL
https://skillnexus-lms-xxxxx-as.a.run.app

AUTH_URL
https://skillnexus-lms-xxxxx-as.a.run.app

NEXT_PUBLIC_URL
https://skillnexus-lms-xxxxx-as.a.run.app

AUTH_TRUST_HOST
true

NODE_ENV
production
```

**⚠️ แทนที่:**
- `[YOUR_PASSWORD]` = Supabase database password
- `xxxxx` = Cloud Run URL ที่ได้จาก step 4

6. Click: "DEPLOY"

---

## 🗄️ Run Database Migrations

### In Cloud Shell:

```bash
cd The-SkillNexus

# Set DATABASE_URL (แทนที่ [YOUR_PASSWORD])
export DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

---

## ✅ Test Your App!

### URL:
```
https://skillnexus-lms-xxxxx-as.a.run.app
```

### Login:
- **Email:** `admin@skillnexus.com`
- **Password:** `Admin@123!`

### Test Accounts:
- **Teacher:** teacher@skillnexus.com / Teacher@123!
- **Student:** student@skillnexus.com / Student@123!

---

## 🎯 Custom Domain (Optional)

### Setup www.uppowerskill.com:

```bash
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=www.uppowerskill.com \
  --region=asia-southeast1
```

Then update DNS records as instructed by Google.

---

## 📊 Monitor Your App

### View Logs:
```bash
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=50
```

### View Metrics:
```
https://console.cloud.google.com/run/detail/asia-southeast1/skillnexus-lms/metrics
```

### View Service Details:
```bash
gcloud run services describe skillnexus-lms --region=asia-southeast1
```

---

## 🔧 Useful Commands

### Update Environment Variables:
```bash
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --update-env-vars="DATABASE_URL=postgresql://..."
```

### Redeploy:
```bash
cd The-SkillNexus
gcloud run deploy skillnexus-lms --source . --region=asia-southeast1
```

### Scale Up:
```bash
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1
```

### Delete Service:
```bash
gcloud run services delete skillnexus-lms --region=asia-southeast1
```

---

## 💰 Cost Estimate

### Free Tier (Monthly):
- ✅ 2 million requests
- ✅ 360,000 GB-seconds
- ✅ 180,000 vCPU-seconds

### Your Configuration:
- Memory: 1GB
- CPU: 1
- Min instances: 0 (pay-per-use)
- Max instances: 10

### Estimated Cost:
- **0-10K requests/day:** $0/month (Free Tier)
- **10K-50K requests/day:** $5-10/month
- **50K-100K requests/day:** $15-20/month

### Database (Supabase):
- ✅ Free forever
- ✅ 500MB storage
- ✅ 2GB bandwidth

**Total: $0-10/month** 🎉

---

## 📝 Deployment Checklist

- [x] Google Cloud Project created: `skillnexus-lms-2025`
- [x] Billing enabled
- [x] Supabase database ready
- [ ] Code pushed to GitHub
- [ ] Deployed to Cloud Run
- [ ] Environment variables added
- [ ] Database migrations run
- [ ] Application tested
- [ ] (Optional) Custom domain configured

---

## 🆘 Troubleshooting

### Build Failed:
```bash
# View build logs
gcloud builds log --region=asia-southeast1

# Check build history
gcloud builds list --limit=5
```

### Database Connection Error:
```bash
# Test connection
psql "postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"

# Check if migrations ran
npx prisma migrate status
```

### 500 Internal Server Error:
```bash
# View recent logs
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=100

# Check environment variables
gcloud run services describe skillnexus-lms --region=asia-southeast1 --format="value(spec.template.spec.containers[0].env)"
```

### Cold Start Issues:
```bash
# Set min instances to 1
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --min-instances=1
```

---

## 🎉 Success Indicators

✅ Build completed successfully  
✅ Service deployed to Cloud Run  
✅ Environment variables configured  
✅ Database migrations completed  
✅ Can login to application  
✅ All features working  

---

## 📚 Documentation

- `QUICK-DEPLOY-GCLOUD.md` - Quick start guide
- `DEPLOY-GOOGLE-CLOUD-STEP-BY-STEP.md` - Detailed guide
- `deploy-commands.txt` - All commands in one file
- `GOOGLE-CLOUD-DEPLOYMENT.md` - Complete documentation

---

## 🚀 Ready to Deploy!

**Everything is configured and ready to go!**

Just follow the commands above and you'll have your LMS running on Google Cloud Run in 10 minutes!

**Good luck! 🎉**
