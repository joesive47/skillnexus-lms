# ☁️ Google Cloud Platform Deployment Guide

## 🎯 Project: upPowerSkill LMS

---

## 📋 Step 1: Install Google Cloud SDK

### Windows Installation:
```powershell
# Download and install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Or use Chocolatey
choco install gcloudsdk

# Verify installation
gcloud --version
```

---

## 🚀 Step 2: Initialize & Create Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your account
gcloud config set account YOUR_EMAIL@gmail.com

# Create project
gcloud projects create uppowerskill --name="upPowerSkill LMS"

# Set as default project
gcloud config set project uppowerskill

# Enable billing (required)
gcloud billing accounts list
gcloud billing projects link uppowerskill --billing-account=BILLING_ACCOUNT_ID
```

---

## 🔧 Step 3: Enable Required APIs

```bash
# Enable Cloud Run (for containers)
gcloud services enable run.googleapis.com

# Enable Cloud SQL (for PostgreSQL)
gcloud services enable sqladmin.googleapis.com

# Enable Cloud Storage (for files)
gcloud services enable storage.googleapis.com

# Enable Cloud CDN
gcloud services enable compute.googleapis.com

# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# Enable Cloud Build
gcloud services enable cloudbuild.googleapis.com
```

---

## 🗄️ Step 4: Setup Cloud SQL (PostgreSQL)

```bash
# Create PostgreSQL instance
gcloud sql instances create skillnexus-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-southeast1 \
  --root-password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create skillnexus \
  --instance=skillnexus-db

# Get connection name
gcloud sql instances describe skillnexus-db \
  --format="value(connectionName)"
```

---

## 📦 Step 5: Build & Deploy to Cloud Run

```bash
# Build Docker image
gcloud builds submit --tag gcr.io/uppowerskill/skillnexus-lms

# Deploy to Cloud Run
gcloud run deploy skillnexus-lms \
  --image gcr.io/uppowerskill/skillnexus-lms \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --add-cloudsql-instances uppowerskill:asia-southeast1:skillnexus-db
```

---

## 🔐 Step 6: Setup Secrets

```bash
# Store database URL
echo -n "postgresql://user:pass@/skillnexus?host=/cloudsql/CONNECTION_NAME" | \
  gcloud secrets create DATABASE_URL --data-file=-

# Store NextAuth secret
echo -n "your-nextauth-secret" | \
  gcloud secrets create NEXTAUTH_SECRET --data-file=-

# Store encryption key
echo -n "your-encryption-key" | \
  gcloud secrets create ENCRYPTION_KEY --data-file=-

# Grant access to Cloud Run
gcloud secrets add-iam-policy-binding DATABASE_URL \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🌐 Step 7: Setup Custom Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service skillnexus-lms \
  --domain uppowerskill.com \
  --region asia-southeast1

# Get DNS records to configure
gcloud run domain-mappings describe \
  --domain uppowerskill.com \
  --region asia-southeast1
```

---

## 📊 Step 8: Setup Monitoring

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Enable Cloud Logging
gcloud services enable logging.googleapis.com

# Create uptime check
gcloud monitoring uptime create uppowerskill-health \
  --resource-type=uptime-url \
  --host=uppowerskill.com \
  --path=/api/health
```

---

## 💰 Cost Estimation

### Free Tier (First 2M requests/month)
- **Cloud Run:** $0 (within free tier)
- **Cloud SQL:** ~$10/month (db-f1-micro)
- **Cloud Storage:** ~$5/month (50GB)
- **Cloud CDN:** ~$10/month
- **Total:** ~$25/month

### Production Tier (100K users)
- **Cloud Run:** ~$100/month (2 vCPU, 2GB RAM)
- **Cloud SQL:** ~$200/month (db-n1-standard-2)
- **Cloud Storage:** ~$50/month (500GB)
- **Cloud CDN:** ~$100/month
- **Total:** ~$450/month

---

## 🔄 Step 9: CI/CD Setup

```yaml
# .github/workflows/deploy-gcp.yml
name: Deploy to Google Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: uppowerskill
          
      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/uppowerskill/skillnexus-lms
          gcloud run deploy skillnexus-lms \
            --image gcr.io/uppowerskill/skillnexus-lms \
            --region asia-southeast1
```

---

## 🎯 Quick Deploy Commands

```bash
# One-command deploy
./deploy-gcp.sh

# Check status
gcloud run services describe skillnexus-lms --region asia-southeast1

# View logs
gcloud run services logs read skillnexus-lms --region asia-southeast1

# Scale up
gcloud run services update skillnexus-lms \
  --max-instances 50 \
  --region asia-southeast1
```

---

## 📝 Environment Variables

```bash
# Set all environment variables
gcloud run services update skillnexus-lms \
  --set-env-vars "
    NODE_ENV=production,
    NEXTAUTH_URL=https://uppowerskill.com,
    NEXT_PUBLIC_APP_URL=https://uppowerskill.com
  " \
  --region asia-southeast1
```

---

## 🛡️ Security Checklist

- [x] Enable Cloud Armor (DDoS protection)
- [x] Setup Cloud CDN
- [x] Configure SSL/TLS
- [x] Enable Secret Manager
- [x] Setup IAM roles
- [x] Enable audit logging
- [x] Configure VPC
- [x] Setup Cloud SQL proxy

---

## 📞 Support

**Google Cloud Console:** https://console.cloud.google.com  
**Project ID:** uppowerskill  
**Region:** asia-southeast1 (Singapore)  
**Service:** Cloud Run + Cloud SQL

---

**Ready to deploy to Google Cloud! ☁️🚀**
