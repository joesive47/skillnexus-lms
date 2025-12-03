# 🚀 Deploy to Google Cloud - Step by Step

**Account**: joesive@gmail.com  
**Project**: uppowerskill  
**Region**: asia-southeast1 (Singapore)

---

## ⚡ DEPLOY NOW (Copy & Paste)

### 1. Install Google Cloud SDK
```bash
# Download: https://cloud.google.com/sdk/docs/install-sdk
# Run installer, then restart terminal
gcloud --version
```

### 2. Login & Setup Project
```bash
# Login
gcloud auth login
# Select: joesive@gmail.com

# Create project
gcloud projects create uppowerskill --name="upPowerSkill LMS"

# Set project
gcloud config set project uppowerskill

# Enable billing (required)
# Go to: https://console.cloud.google.com/billing
```

### 3. Enable APIs
```bash
gcloud services enable appengine.googleapis.com sqladmin.googleapis.com redis.googleapis.com storage.googleapis.com
```

### 4. Create App Engine
```bash
gcloud app create --region=asia-southeast1
```

### 5. Create Database
```bash
# Create Cloud SQL instance (takes 5 min)
gcloud sql instances create uppowerskill-db --database-version=POSTGRES_15 --tier=db-f1-micro --region=asia-southeast1 --root-password=UpPower2025!

# Create database
gcloud sql databases create uppowerskill --instance=uppowerskill-db

# Get connection name (copy this!)
gcloud sql instances describe uppowerskill-db --format="value(connectionName)"
```

### 6. Create Redis
```bash
# Create Redis (takes 3 min)
gcloud redis instances create uppowerskill-cache --size=1 --region=asia-southeast1 --redis-version=redis_7_0

# Get host IP (copy this!)
gcloud redis instances describe uppowerskill-cache --region=asia-southeast1 --format="value(host)"
```

### 7. Create Storage
```bash
gsutil mb -l asia-southeast1 gs://uppowerskill-storage
gsutil iam ch allUsers:objectViewer gs://uppowerskill-storage
```

### 8. Update .env
```bash
# Copy template
copy .env.production .env

# Edit .env with:
# - DATABASE_URL from Step 5
# - REDIS_URL from Step 6
# - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
# - OPENAI_API_KEY (your key)
```

### 9. Import Knowledge Base
```bash
# Copy file
copy "%USERPROFILE%\Downloads\knowledge-base-1763982823686.json" knowledge-base.json

# Import
npm run import:knowledge
```

### 10. Deploy!
```bash
# Build
npm run build

# Deploy to Google Cloud
gcloud app deploy

# Open in browser
gcloud app browse
```

---

## ✅ Verify Deployment

```bash
# Check status
gcloud app describe

# View logs
gcloud app logs tail

# Test endpoints
curl https://uppowerskill.uc.r.appspot.com/api/health
```

---

## 🎯 Expected Output

```
Services to deploy:
  descriptor:      [app.yaml]
  source:          [.]
  target project:  [uppowerskill]
  target service:  [default]
  target version:  [20250124t123456]
  target url:      [https://uppowerskill.uc.r.appspot.com]

Do you want to continue (Y/n)? Y

Beginning deployment...
✓ Uploading files
✓ Building container
✓ Deploying service
✓ Routing traffic

Deployed service [default] to [https://uppowerskill.uc.r.appspot.com]
```

---

## 💰 Cost (First Month)

- App Engine F1: **FREE** (28 hours/day free tier)
- Cloud SQL db-f1-micro: **$7/month**
- Redis 1GB: **$30/month**
- Storage 5GB: **FREE**
- **Total: ~$37/month**

---

## 🆘 Troubleshooting

### Build Failed
```bash
# Clear cache
rmdir /s /q .next
npm run build
```

### Database Connection Failed
```bash
# Check connection name
gcloud sql instances describe uppowerskill-db

# Test connection
gcloud sql connect uppowerskill-db --user=postgres
```

### Deploy Failed
```bash
# Check logs
gcloud app logs read --limit 50

# Re-deploy
gcloud app deploy --quiet
```

---

## 📞 Support

- **Console**: https://console.cloud.google.com
- **Docs**: https://cloud.google.com/appengine/docs
- **Email**: joesive@gmail.com

---

**READY TO GO LIVE! 🚀**

Just run:
```bash
gcloud auth login
gcloud app deploy
```
