# 🚀 SkillNexus LMS - Deployment Checklist

## Phase 9: Google Cloud Deployment to uppowerskill.com

---

## ✅ Completed Tasks

### 1. Google Cloud Setup
- [x] Install Google Cloud SDK
- [x] Create project: `skillnexus-lms-2025`
- [x] Enable billing ($300 free credit)
- [x] Set region: `asia-southeast1`
- [x] Enable required APIs (6 APIs)

### 2. Domain
- [x] Domain purchased: `uppowerskill.com`
- [ ] Domain verified in Google Cloud
- [ ] DNS configured

---

## 📋 Next Steps

### Step 1: Prepare Application for Production

```bash
# Update environment variables
cp .env.example .env.production
```

**Edit `.env.production`:**
```env
# Domain
NEXT_PUBLIC_APP_URL=https://uppowerskill.com
NEXTAUTH_URL=https://uppowerskill.com

# Database (will create in Step 2)
DATABASE_URL=postgresql://user:pass@/db?host=/cloudsql/skillnexus-lms-2025:asia-southeast1:skillnexus-db

# NextAuth
NEXTAUTH_SECRET=your-secret-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

### Step 2: Create Cloud SQL Database

```bash
# Create PostgreSQL instance
gcloud sql instances create skillnexus-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-southeast1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00

# Create database
gcloud sql databases create skillnexus --instance=skillnexus-db

# Create user
gcloud sql users create skillnexus-user \
  --instance=skillnexus-db \
  --password=YOUR_SECURE_PASSWORD

# Get connection name
gcloud sql instances describe skillnexus-db \
  --format="value(connectionName)"
```

**Cost**: ~$7.67/month

---

### Step 3: Create Cloud Storage Bucket

```bash
# Create bucket for assets
gsutil mb -p skillnexus-lms-2025 \
  -c STANDARD \
  -l asia-southeast1 \
  gs://uppowerskill-assets

# Make bucket public (for static assets)
gsutil iam ch allUsers:objectViewer gs://uppowerskill-assets

# Create folders
gsutil mkdir gs://uppowerskill-assets/videos
gsutil mkdir gs://uppowerskill-assets/documents
gsutil mkdir gs://uppowerskill-assets/scorm
gsutil mkdir gs://uppowerskill-assets/certificates
```

**Cost**: ~$0.026/GB/month

---

### Step 4: Store Secrets in Secret Manager

```bash
# Database password
echo "YOUR_DB_PASSWORD" | gcloud secrets create db-password --data-file=-

# NextAuth secret
openssl rand -base64 32 | gcloud secrets create nextauth-secret --data-file=-

# JWT secret
openssl rand -base64 32 | gcloud secrets create jwt-secret --data-file=-

# List secrets
gcloud secrets list
```

---

### Step 5: Build and Deploy to Cloud Run

```bash
# Build Docker image (if using Docker)
# Or deploy directly from source

# Deploy to Cloud Run
gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="NEXT_PUBLIC_APP_URL=https://uppowerskill.com" \
  --set-secrets="DATABASE_URL=db-password:latest,NEXTAUTH_SECRET=nextauth-secret:latest" \
  --add-cloudsql-instances=skillnexus-lms-2025:asia-southeast1:skillnexus-db

# Get service URL
gcloud run services describe skillnexus-lms \
  --region=asia-southeast1 \
  --format="value(status.url)"
```

**Cost**: $0.40/million requests

---

### Step 6: Verify Domain Ownership

```bash
# Method 1: Using gcloud
gcloud domains verify uppowerskill.com

# Method 2: Google Search Console
# Go to: https://search.google.com/search-console
# Add property: uppowerskill.com
# Verify using DNS TXT record
```

**Add TXT record to DNS:**
```
Type: TXT
Name: @
Value: google-site-verification=XXXXX
TTL: 3600
```

---

### Step 7: Map Custom Domain

```bash
# Map root domain
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=uppowerskill.com \
  --region=asia-southeast1

# Map www subdomain
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=www.uppowerskill.com \
  --region=asia-southeast1

# Get DNS records to configure
gcloud run domain-mappings describe uppowerskill.com \
  --region=asia-southeast1
```

---

### Step 8: Configure DNS at Domain Registrar

**Where you bought uppowerskill.com (GoDaddy/Namecheap/Cloudflare):**

#### A Record (Root Domain)
```
Type: A
Name: @
Value: [IP from Step 7]
TTL: 3600
```

#### CNAME Record (www)
```
Type: CNAME
Name: www
Value: ghs.googlehosted.com
TTL: 3600
```

**Check DNS propagation:**
- https://dnschecker.org

---

### Step 9: Wait for SSL Certificate

Google Cloud will automatically provision SSL certificate:
- Time: 15-30 minutes
- Check status:

```bash
gcloud run domain-mappings describe uppowerskill.com \
  --region=asia-southeast1 \
  --format="value(status.conditions)"
```

---

### Step 10: Run Database Migrations

```bash
# Connect to Cloud SQL
gcloud sql connect skillnexus-db --user=skillnexus-user

# Or use Cloud SQL Proxy
cloud_sql_proxy -instances=skillnexus-lms-2025:asia-southeast1:skillnexus-db=tcp:5432

# Run Prisma migrations
npm run db:push
npm run db:seed
```

---

### Step 11: Test Deployment

```bash
# Test homepage
curl https://uppowerskill.com

# Test API
curl https://uppowerskill.com/api/health

# Test SSL
curl -I https://uppowerskill.com | grep -i "HTTP\|SSL"

# Load test (optional)
ab -n 1000 -c 10 https://uppowerskill.com/
```

---

### Step 12: Configure Monitoring

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud monitoring uptime-checks create https://uppowerskill.com \
  --display-name="SkillNexus Uptime" \
  --check-interval=60s

# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

---

## 🔐 Security Checklist

- [ ] Enable Cloud Armor (DDoS protection)
- [ ] Configure WAF rules
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Configure CORS properly
- [ ] Add security headers
- [ ] Enable HTTPS only
- [ ] Set up backup strategy

---

## 💰 Cost Summary

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| Cloud Run | 1M requests | $0-10 |
| Cloud SQL | db-f1-micro | $7.67 |
| Cloud Storage | 10GB | $0.26 |
| Secret Manager | 3 secrets | $0.18 |
| Monitoring | Basic | $0-5 |
| **Total** | | **~$8-23/month** |

**With Free Tier:**
- First 90 days: $300 credit
- Effective cost: $0 for 3 months

---

## 📊 Performance Targets

- [ ] Response time: <200ms
- [ ] Uptime: 99.9%
- [ ] SSL Labs: A+ rating
- [ ] Lighthouse: 90+ score
- [ ] Time to First Byte: <100ms

---

## 🚨 Rollback Plan

If deployment fails:

```bash
# Rollback to previous revision
gcloud run services update-traffic skillnexus-lms \
  --to-revisions=PREVIOUS_REVISION=100 \
  --region=asia-southeast1

# Delete domain mapping
gcloud run domain-mappings delete uppowerskill.com \
  --region=asia-southeast1
```

---

## 📚 Documentation Links

- [Google Cloud Setup](docs/GOOGLE_CLOUD_SETUP.md)
- [Custom Domain Setup](docs/CUSTOM_DOMAIN_SETUP.md)
- [Phase 9 Progress](PHASE9_PROGRESS.md)

---

## ✅ Final Verification

After deployment, verify:

- [ ] https://uppowerskill.com loads correctly
- [ ] https://www.uppowerskill.com redirects properly
- [ ] SSL certificate is valid (A+ rating)
- [ ] Login/Register works
- [ ] Database connection works
- [ ] File uploads work (Cloud Storage)
- [ ] All APIs respond correctly
- [ ] Mobile responsive
- [ ] Performance metrics meet targets

---

## 🎉 Go Live!

Once all checks pass:

1. Announce on social media
2. Update DNS TTL to 300 (5 minutes)
3. Monitor logs for 24 hours
4. Set up alerts for errors
5. Create backup schedule

---

**Status**: Ready to deploy  
**Domain**: uppowerskill.com  
**Project**: skillnexus-lms-2025  
**Region**: asia-southeast1  
**Next**: Execute Step 1-12
