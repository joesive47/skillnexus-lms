# ☁️ Google Cloud Setup - joesive@gmail.com

## 🚀 Quick Setup (15 minutes)

### Step 1: Install Google Cloud SDK
```bash
# Download from: https://cloud.google.com/sdk/docs/install
# Or use installer: GoogleCloudSDKInstaller.exe

# Verify installation
gcloud --version
```

### Step 2: Login & Initialize
```bash
# Login with joesive@gmail.com
gcloud auth login

# Initialize project
gcloud init

# Select or create project: uppowerskill
# Select region: asia-southeast1 (Singapore)
```

### Step 3: Enable Required APIs
```bash
# Enable APIs
gcloud services enable \
  appengine.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  storage.googleapis.com \
  cloudscheduler.googleapis.com

# Verify
gcloud services list --enabled
```

### Step 4: Create App Engine
```bash
# Create App Engine app
gcloud app create --region=asia-southeast1

# Verify
gcloud app describe
```

### Step 5: Setup Cloud SQL (PostgreSQL)
```bash
# Create instance
gcloud sql instances create uppowerskill-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-southeast1 \
  --root-password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create uppowerskill \
  --instance=uppowerskill-db

# Get connection name
gcloud sql instances describe uppowerskill-db \
  --format="value(connectionName)"
```

### Step 6: Setup Redis (Memorystore)
```bash
# Create Redis instance
gcloud redis instances create uppowerskill-cache \
  --size=1 \
  --region=asia-southeast1 \
  --redis-version=redis_7_0

# Get host IP
gcloud redis instances describe uppowerskill-cache \
  --region=asia-southeast1 \
  --format="value(host)"
```

### Step 7: Setup Cloud Storage
```bash
# Create bucket
gsutil mb -l asia-southeast1 gs://uppowerskill-storage

# Set public access for static files
gsutil iam ch allUsers:objectViewer gs://uppowerskill-storage
```

## 📝 Update .env with Connection Strings

```env
# Database (from Step 5)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@/uppowerskill?host=/cloudsql/PROJECT_ID:asia-southeast1:uppowerskill-db"

# Redis (from Step 6)
REDIS_URL="redis://REDIS_HOST_IP:6379"

# Storage (from Step 7)
GCS_BUCKET="uppowerskill-storage"
GCS_PROJECT_ID="YOUR_PROJECT_ID"
```

## 🚀 Deploy Commands

```bash
# Deploy application
gcloud app deploy

# Deploy cron jobs
gcloud app deploy cron.yaml

# View logs
gcloud app logs tail -s default

# Open in browser
gcloud app browse
```

## 💰 Cost Estimate (Free Tier)

- **App Engine**: F1 instance - FREE (28 hours/day)
- **Cloud SQL**: db-f1-micro - ~$7/month
- **Redis**: 1GB - ~$30/month
- **Storage**: 5GB - FREE
- **Total**: ~$37/month

## 🎯 Production Upgrade (Later)

```bash
# Upgrade Cloud SQL
gcloud sql instances patch uppowerskill-db \
  --tier=db-n1-standard-1

# Upgrade Redis
gcloud redis instances update uppowerskill-cache \
  --size=5 \
  --region=asia-southeast1

# Enable auto-scaling
# Edit app.yaml: automatic_scaling
```

## 📊 Monitoring

```bash
# View metrics
gcloud app instances list

# View logs
gcloud app logs read

# SSH to instance
gcloud app instances ssh INSTANCE_ID
```

## 🔐 Security

```bash
# Create service account
gcloud iam service-accounts create uppowerskill-sa

# Grant permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:uppowerskill-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# Download key
gcloud iam service-accounts keys create key.json \
  --iam-account=uppowerskill-sa@PROJECT_ID.iam.gserviceaccount.com
```

## ✅ Verification Checklist

- [ ] Google Cloud SDK installed
- [ ] Logged in as joesive@gmail.com
- [ ] Project created: uppowerskill
- [ ] App Engine initialized
- [ ] Cloud SQL running
- [ ] Redis running
- [ ] Storage bucket created
- [ ] .env updated with connection strings

---

**Ready to deploy! Run: `gcloud app deploy`** 🚀
