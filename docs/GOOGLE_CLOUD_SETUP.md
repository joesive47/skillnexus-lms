# 🚀 Google Cloud Setup Guide - SkillNexus LMS

## Phase 9: Enterprise Security Infrastructure

### 📋 Prerequisites
- Windows 10/11
- PowerShell 5.1+
- Google Account
- Credit Card (for billing)

---

## 🔧 Installation Steps

### Step 1: Install Google Cloud SDK

```powershell
# Run installation script
.\scripts\setup-gcloud.ps1
```

**Manual Installation:**
1. Download: https://cloud.google.com/sdk/docs/install
2. Run installer
3. Follow setup wizard
4. Restart terminal

### Step 2: Authenticate

```bash
# Login to Google Cloud
gcloud auth login

# Set default account
gcloud config set account your-email@gmail.com
```

### Step 3: Create Project

```powershell
# Create SkillNexus LMS project
.\scripts\setup-gcloud-project.ps1 -ProjectId "skillnexus-lms-prod"
```

**Manual Creation:**
```bash
# Create project
gcloud projects create skillnexus-lms-prod --name="SkillNexus LMS Production"

# Set active project
gcloud config set project skillnexus-lms-prod

# Set region
gcloud config set compute/region asia-southeast1
```

### Step 4: Enable Billing

1. Go to: https://console.cloud.google.com/billing
2. Link billing account to project
3. Verify billing is enabled

### Step 5: Create Resources

```powershell
# Provision cloud resources
.\scripts\setup-gcloud-resources.ps1
```

---

## 🏗️ Architecture Overview

### Infrastructure Components

```
┌─────────────────────────────────────────┐
│         Google Cloud Platform           │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Cloud Run   │  │  Cloud SQL   │   │
│  │  (Next.js)   │──│ (PostgreSQL) │   │
│  └──────────────┘  └──────────────┘   │
│         │                               │
│         ├──────┬──────────┬────────┐   │
│         │      │          │        │   │
│  ┌──────▼──┐ ┌▼────────┐ ┌▼─────┐ │   │
│  │ Storage │ │  Redis  │ │ KMS  │ │   │
│  │ Bucket  │ │  Cache  │ │Secret│ │   │
│  └─────────┘ └─────────┘ └──────┘ │   │
│                                     │   │
│  ┌─────────────────────────────┐   │   │
│  │   Cloud Monitoring & Logs   │   │   │
│  └─────────────────────────────┘   │   │
└─────────────────────────────────────────┘
```

---

## 📦 Resources Created

### 1. Cloud Storage
- **Bucket**: `skillnexus-lms-prod-assets`
- **Purpose**: Store videos, documents, SCORM packages
- **Region**: asia-southeast1
- **Storage Class**: Standard

### 2. Cloud SQL (PostgreSQL)
- **Instance**: `skillnexus-db`
- **Version**: PostgreSQL 15
- **Tier**: db-f1-micro (upgradable)
- **Storage**: 10GB SSD
- **Backup**: Daily at 3:00 AM

### 3. Redis Cache
- **Instance**: `skillnexus-cache`
- **Version**: Redis 7.0
- **Size**: 1GB
- **Tier**: Basic (upgradable to Standard HA)

### 4. Secret Manager
- `db-password` - Database password
- `nextauth-secret` - NextAuth.js secret
- `jwt-secret` - JWT signing key

### 5. Service Account
- **Name**: `skillnexus-app`
- **Roles**: 
  - Cloud SQL Client
  - Secret Manager Accessor
  - Storage Object Admin

---

## 🔐 Security Configuration

### Enable Security Features

```bash
# Enable Cloud Armor (DDoS protection)
gcloud compute security-policies create skillnexus-security \
    --description="SkillNexus LMS Security Policy"

# Enable Identity-Aware Proxy
gcloud iap web enable --resource-type=app-engine

# Enable VPC Service Controls
gcloud access-context-manager perimeters create skillnexus-perimeter \
    --title="SkillNexus Security Perimeter"
```

---

## 💰 Cost Estimation

### Monthly Costs (Estimated)

| Service | Tier | Cost |
|---------|------|------|
| Cloud Run | 1M requests | $0-50 |
| Cloud SQL | db-f1-micro | $7.67 |
| Redis | 1GB Basic | $31.68 |
| Storage | 100GB | $2.60 |
| Monitoring | Standard | $0-10 |
| **Total** | | **~$50-100/month** |

### Production Scale (100K users)

| Service | Tier | Cost |
|---------|------|------|
| Cloud Run | 100M requests | $400 |
| Cloud SQL | db-n1-standard-4 | $290 |
| Redis | 5GB Standard HA | $158 |
| Storage | 1TB + CDN | $50 |
| Monitoring | Premium | $50 |
| **Total** | | **~$950/month** |

---

## 🚀 Deployment

### Deploy to Cloud Run

```bash
# Build and deploy
gcloud run deploy skillnexus-lms \
    --source . \
    --platform managed \
    --region asia-southeast1 \
    --allow-unauthenticated \
    --set-env-vars="DATABASE_URL=postgresql://..." \
    --set-secrets="NEXTAUTH_SECRET=nextauth-secret:latest"
```

---

## 📊 Monitoring

### View Logs
```bash
# Application logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Database logs
gcloud sql operations list --instance=skillnexus-db
```

### Metrics Dashboard
- Console: https://console.cloud.google.com/monitoring
- Uptime checks
- Performance metrics
- Error rates

---

## 🔧 Useful Commands

```bash
# List projects
gcloud projects list

# Switch project
gcloud config set project skillnexus-lms-prod

# View current config
gcloud config list

# List resources
gcloud sql instances list
gcloud redis instances list
gsutil ls

# View costs
gcloud billing accounts list
gcloud billing projects describe skillnexus-lms-prod

# Delete resources (careful!)
gcloud sql instances delete skillnexus-db
gcloud redis instances delete skillnexus-cache
gsutil rm -r gs://skillnexus-lms-prod-assets
```

---

## 🆘 Troubleshooting

### Issue: API not enabled
```bash
# Enable required API
gcloud services enable compute.googleapis.com
```

### Issue: Permission denied
```bash
# Grant yourself owner role
gcloud projects add-iam-policy-binding skillnexus-lms-prod \
    --member="user:your-email@gmail.com" \
    --role="roles/owner"
```

### Issue: Billing not enabled
1. Go to: https://console.cloud.google.com/billing
2. Link billing account
3. Wait 5-10 minutes for propagation

---

## 📚 Resources

- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Cloud SQL Best Practices](https://cloud.google.com/sql/docs/postgres/best-practices)
- [Security Best Practices](https://cloud.google.com/security/best-practices)

---

## ✅ Next Steps

1. ✅ Install Google Cloud SDK
2. ✅ Create project
3. ✅ Enable billing
4. ✅ Provision resources
5. ⏭️ Configure environment variables
6. ⏭️ Deploy application
7. ⏭️ Set up monitoring
8. ⏭️ Configure custom domain

---

**Phase 9 Progress: Google Cloud Infrastructure Setup Complete! 🎉**
