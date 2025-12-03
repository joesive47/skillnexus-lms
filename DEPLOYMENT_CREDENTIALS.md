# 🔐 SkillNexus LMS - Deployment Credentials

**⚠️ CONFIDENTIAL - DO NOT COMMIT TO GIT**

---

## 📋 Google Cloud Project

- **Project ID**: `skillnexus-lms-2025`
- **Project Number**: `228323874056`
- **Region**: `asia-southeast1`
- **Zone**: `asia-southeast1-b`
- **Account**: `joesive@gmail.com`

---

## 🗄️ Cloud SQL Database

- **Instance Name**: `skillnexus-db`
- **Database Version**: PostgreSQL 15
- **Tier**: db-f1-micro
- **Location**: asia-southeast1-b
- **Public IP**: `34.124.203.250`
- **Connection Name**: `skillnexus-lms-2025:asia-southeast1:skillnexus-db`

### Database Credentials

- **Database Name**: `skillnexus`
- **Username**: `skillnexus-user`
- **Password**: `SkillNexus2025!Secure`

### Connection String

```
postgresql://skillnexus-user:SkillNexus2025!Secure@34.124.203.250:5432/skillnexus?sslmode=require
```

---

## 📦 Cloud Storage

- **Bucket Name**: `uppowerskill-assets`
- **Location**: asia-southeast1
- **Storage Class**: STANDARD
- **Public Access**: Enabled (objectViewer)
- **URL**: `https://storage.googleapis.com/uppowerskill-assets`

---

## 🔑 Secret Manager

### db-password
```
SkillNexus2025!Secure
```

### nextauth-secret
```
rmQnCNXy9qxpobw61k3E2HWAcRezvfgt
```

### jwt-secret
```
jUng2EDA3aWX80GsJwkyCML1rQSVpPbN
```

---

## 🌐 Domain Configuration

- **Domain**: `uppowerskill.com`
- **Status**: Purchased, not yet configured
- **DNS**: Pending configuration

### DNS Records to Configure

**A Record (Root Domain)**
```
Type: A
Name: @
Value: [Will be provided after Cloud Run deployment]
TTL: 3600
```

**CNAME Record (www)**
```
Type: CNAME
Name: www
Value: ghs.googlehosted.com
TTL: 3600
```

---

## 🚀 Deployment Commands

### Connect to Database
```bash
# Using Cloud SQL Proxy
gcloud sql connect skillnexus-db --user=skillnexus-user

# Direct connection
psql "postgresql://skillnexus-user:SkillNexus2025!Secure@34.124.203.250:5432/skillnexus?sslmode=require"
```

### Access Secrets
```bash
gcloud secrets versions access latest --secret=db-password
gcloud secrets versions access latest --secret=nextauth-secret
gcloud secrets versions access latest --secret=jwt-secret
```

### View Resources
```bash
# List SQL instances
gcloud sql instances list

# List storage buckets
gcloud storage buckets list

# List secrets
gcloud secrets list
```

---

## 💰 Cost Tracking

### Current Resources

| Resource | Configuration | Monthly Cost |
|----------|--------------|--------------|
| Cloud SQL | db-f1-micro | $7.67 |
| Cloud Storage | 0GB (empty) | $0.00 |
| Secret Manager | 3 secrets | $0.18 |
| **Total** | | **$7.85/month** |

### Free Tier Status
- **Credit Remaining**: $300
- **Days Remaining**: 90 days
- **Effective Cost**: $0 (covered by free credit)

---

## 📝 Next Steps

1. ✅ Cloud SQL created
2. ✅ Database created
3. ✅ User created
4. ✅ Storage bucket created
5. ✅ Secrets stored
6. ⏭️ Deploy application to Cloud Run
7. ⏭️ Map custom domain
8. ⏭️ Configure DNS
9. ⏭️ Run database migrations
10. ⏭️ Test deployment

---

## 🔒 Security Notes

- All passwords are stored in Secret Manager
- Database requires SSL connection
- Storage bucket has public read access (for static assets)
- Never commit this file to Git
- Rotate secrets every 90 days
- Enable Cloud Armor for DDoS protection

---

**Created**: January 2025  
**Last Updated**: January 2025  
**Status**: Infrastructure Ready - Awaiting Deployment
