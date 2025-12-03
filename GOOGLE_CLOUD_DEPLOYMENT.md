# 🚀 Google Cloud Deployment Guide - SkillNexus LMS

## 📋 Prerequisites

### 1. Google Cloud Account
- Create account at https://cloud.google.com
- Enable billing
- Create new project

### 2. Install Google Cloud SDK
```bash
# Download from: https://cloud.google.com/sdk/docs/install
gcloud init
gcloud auth login
```

### 3. Enable Required APIs
```bash
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable run.googleapis.com
```

## 🗄️ Database Setup (Cloud SQL)

### Create PostgreSQL Instance
```bash
gcloud sql instances create skillnexus-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-southeast1

# Create database
gcloud sql databases create skillnexus \
  --instance=skillnexus-db

# Set password
gcloud sql users set-password postgres \
  --instance=skillnexus-db \
  --password=YOUR_SECURE_PASSWORD
```

### Get Connection String
```bash
gcloud sql instances describe skillnexus-db
```

## 🔧 Environment Configuration

### Update `.env.production`
```env
# Database
DATABASE_URL="postgresql://postgres:PASSWORD@/skillnexus?host=/cloudsql/PROJECT_ID:REGION:skillnexus-db"

# NextAuth
NEXTAUTH_URL="https://PROJECT_ID.appspot.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Redis (Optional - Cloud Memorystore)
REDIS_URL="redis://MEMORYSTORE_IP:6379"
```

## 🚀 Deployment Options

### Option 1: App Engine (Recommended for beginners)

#### 1. Update `app.yaml`
```yaml
runtime: nodejs20
env: standard
instance_class: F2

env_variables:
  DATABASE_URL: "your-connection-string"
  NEXTAUTH_URL: "https://your-project.appspot.com"
  NEXTAUTH_SECRET: "your-secret"
```

#### 2. Deploy
```bash
# Build
npm run build

# Deploy
gcloud app deploy
```

#### 3. View App
```bash
gcloud app browse
```

### Option 2: Cloud Run (Recommended for production)

#### 1. Build Container
```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/skillnexus

# Or use Docker
docker build -f Dockerfile.gcloud -t gcr.io/PROJECT_ID/skillnexus .
docker push gcr.io/PROJECT_ID/skillnexus
```

#### 2. Deploy to Cloud Run
```bash
gcloud run deploy skillnexus \
  --image gcr.io/PROJECT_ID/skillnexus \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="your-connection-string" \
  --set-env-vars NEXTAUTH_URL="https://skillnexus-xxx.run.app" \
  --set-env-vars NEXTAUTH_SECRET="your-secret" \
  --add-cloudsql-instances PROJECT_ID:REGION:skillnexus-db
```

### Option 3: Cloud Build (CI/CD)

#### 1. Setup Cloud Build Trigger
```bash
gcloud builds triggers create github \
  --repo-name=The-SkillNexus \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

#### 2. Push to GitHub
```bash
git push origin main
# Auto-deploy on push
```

## 📦 Static Assets (Cloud Storage)

### Create Storage Bucket
```bash
# Create bucket
gsutil mb -l asia-southeast1 gs://skillnexus-assets

# Make public
gsutil iam ch allUsers:objectViewer gs://skillnexus-assets

# Upload files
gsutil -m cp -r public/* gs://skillnexus-assets/
```

### Update Next.js Config
```javascript
// next.config.js
module.exports = {
  assetPrefix: 'https://storage.googleapis.com/skillnexus-assets',
}
```

## 🔐 Secrets Management

### Use Secret Manager
```bash
# Create secrets
echo -n "your-database-url" | gcloud secrets create database-url --data-file=-
echo -n "your-nextauth-secret" | gcloud secrets create nextauth-secret --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 📊 Monitoring & Logging

### View Logs
```bash
# App Engine
gcloud app logs tail

# Cloud Run
gcloud run services logs read skillnexus --region=asia-southeast1
```

### Setup Monitoring
```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# View metrics in console
https://console.cloud.google.com/monitoring
```

## 🔄 Database Migration

### Run Prisma Migrations
```bash
# Connect to Cloud SQL
gcloud sql connect skillnexus-db --user=postgres

# Run migrations locally
DATABASE_URL="your-connection-string" npx prisma migrate deploy

# Or use Cloud Build
gcloud builds submit --config=cloudbuild-migrate.yaml
```

## 💰 Cost Optimization

### Free Tier Limits
- **App Engine**: 28 instance hours/day
- **Cloud SQL**: db-f1-micro free
- **Cloud Storage**: 5GB free
- **Cloud Build**: 120 build-minutes/day

### Estimated Monthly Cost
- **Starter**: $0-10 (Free tier)
- **Small**: $20-50 (100 users)
- **Medium**: $100-200 (1000 users)
- **Large**: $500+ (10000+ users)

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check Cloud SQL status
gcloud sql instances describe skillnexus-db

# Test connection
gcloud sql connect skillnexus-db --user=postgres
```

#### 2. Build Timeout
```yaml
# Increase timeout in cloudbuild.yaml
timeout: '1600s'
```

#### 3. Memory Issues
```yaml
# Increase instance class in app.yaml
instance_class: F4
```

## 📝 Deployment Checklist

- [ ] Create Google Cloud project
- [ ] Enable required APIs
- [ ] Setup Cloud SQL database
- [ ] Configure environment variables
- [ ] Update `app.yaml` or Dockerfile
- [ ] Build application
- [ ] Deploy to App Engine/Cloud Run
- [ ] Run database migrations
- [ ] Test application
- [ ] Setup monitoring
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS
- [ ] Setup backups

## 🌐 Custom Domain

### Add Custom Domain
```bash
# Map domain
gcloud app domain-mappings create www.yourdomain.com

# Follow DNS instructions
# Add A and AAAA records
```

## 🔄 Continuous Deployment

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Google Cloud
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
      - run: gcloud app deploy
```

## 📞 Support

- **Google Cloud Console**: https://console.cloud.google.com
- **Documentation**: https://cloud.google.com/docs
- **Support**: https://cloud.google.com/support

---

**Status:** ✅ Ready for Google Cloud Deployment
**Estimated Setup Time:** 30-60 minutes
**Difficulty:** Intermediate
