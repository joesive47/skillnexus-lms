# 🌐 Custom Domain Setup - uppowerskill.com

## Overview
ผูก domain `uppowerskill.com` กับ SkillNexus LMS บน Google Cloud

---

## 📋 Prerequisites
- ✅ Google Cloud Project: `skillnexus-lms-2025`
- ✅ Domain: `uppowerskill.com` (ซื้อแล้ว)
- ⏳ Cloud Run deployment (ยังไม่ได้ deploy)

---

## 🚀 Setup Steps

### Step 1: Verify Domain Ownership

```bash
# Enable Domain Mapping API
gcloud services enable domains.googleapis.com

# Verify domain (will provide TXT record)
gcloud domains verify uppowerskill.com
```

**Manual Verification:**
1. Go to: https://search.google.com/search-console
2. Add property: `uppowerskill.com`
3. Verify using DNS TXT record

---

### Step 2: Deploy Application to Cloud Run

```bash
# Deploy SkillNexus LMS
gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars="NEXTAUTH_URL=https://uppowerskill.com"
```

**Get Cloud Run URL:**
```bash
gcloud run services describe skillnexus-lms \
  --region=asia-southeast1 \
  --format="value(status.url)"
```

---

### Step 3: Map Custom Domain

```bash
# Map domain to Cloud Run service
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=uppowerskill.com \
  --region=asia-southeast1

# Map www subdomain
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=www.uppowerskill.com \
  --region=asia-southeast1
```

---

### Step 4: Configure DNS Records

**ที่ Domain Registrar (เช่น GoDaddy, Namecheap, Cloudflare):**

#### A Record (Root Domain)
```
Type: A
Name: @
Value: [IP from Cloud Run - see below]
TTL: 3600
```

#### CNAME Record (www)
```
Type: CNAME
Name: www
Value: ghs.googlehosted.com
TTL: 3600
```

**Get DNS Records:**
```bash
gcloud run domain-mappings describe uppowerskill.com \
  --region=asia-southeast1
```

---

### Step 5: SSL Certificate (Automatic)

Google Cloud จะสร้าง SSL certificate อัตโนมัติ:
- ใช้เวลา 15-30 นาที
- ตรวจสอบสถานะ:

```bash
gcloud run domain-mappings describe uppowerskill.com \
  --region=asia-southeast1 \
  --format="value(status.conditions)"
```

---

## 🔧 Alternative: Using Cloud Load Balancer

สำหรับ production ที่ต้องการ:
- Global CDN
- DDoS protection
- Advanced routing

### Setup Load Balancer

```bash
# 1. Create serverless NEG
gcloud compute network-endpoint-groups create skillnexus-neg \
  --region=asia-southeast1 \
  --network-endpoint-type=serverless \
  --cloud-run-service=skillnexus-lms

# 2. Create backend service
gcloud compute backend-services create skillnexus-backend \
  --global

# 3. Add NEG to backend
gcloud compute backend-services add-backend skillnexus-backend \
  --global \
  --network-endpoint-group=skillnexus-neg \
  --network-endpoint-group-region=asia-southeast1

# 4. Create URL map
gcloud compute url-maps create skillnexus-lb \
  --default-service=skillnexus-backend

# 5. Create SSL certificate
gcloud compute ssl-certificates create skillnexus-cert \
  --domains=uppowerskill.com,www.uppowerskill.com

# 6. Create HTTPS proxy
gcloud compute target-https-proxies create skillnexus-proxy \
  --url-map=skillnexus-lb \
  --ssl-certificates=skillnexus-cert

# 7. Create forwarding rule
gcloud compute forwarding-rules create skillnexus-https \
  --global \
  --target-https-proxy=skillnexus-proxy \
  --ports=443

# 8. Get IP address
gcloud compute forwarding-rules describe skillnexus-https \
  --global \
  --format="value(IPAddress)"
```

---

## 📝 Environment Variables

Update `.env.production`:

```env
# Domain Configuration
NEXT_PUBLIC_APP_URL=https://uppowerskill.com
NEXTAUTH_URL=https://uppowerskill.com

# API Endpoints
NEXT_PUBLIC_API_URL=https://uppowerskill.com/api

# CDN (if using Cloud CDN)
NEXT_PUBLIC_CDN_URL=https://cdn.uppowerskill.com
```

---

## ✅ Verification

### Check Domain Status
```bash
# Check domain mapping
gcloud run domain-mappings list --region=asia-southeast1

# Check SSL certificate
curl -I https://uppowerskill.com

# Test DNS resolution
nslookup uppowerskill.com
```

### Test Endpoints
```bash
# Homepage
curl https://uppowerskill.com

# API Health Check
curl https://uppowerskill.com/api/health

# Login page
curl https://uppowerskill.com/login
```

---

## 🔄 Subdomain Configuration

### Setup Subdomains

```bash
# API subdomain
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=api.uppowerskill.com \
  --region=asia-southeast1

# Admin subdomain
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=admin.uppowerskill.com \
  --region=asia-southeast1

# CDN subdomain (for static assets)
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=cdn.uppowerskill.com \
  --region=asia-southeast1
```

**DNS Records:**
```
Type: CNAME
Name: api
Value: ghs.googlehosted.com

Type: CNAME
Name: admin
Value: ghs.googlehosted.com

Type: CNAME
Name: cdn
Value: ghs.googlehosted.com
```

---

## 💰 Cost Implications

### Domain Mapping
- **Free** - No additional cost

### SSL Certificate
- **Free** - Google-managed SSL

### Load Balancer (Optional)
- Forwarding rules: $18/month
- Data processing: $0.008-0.016/GB
- CDN: $0.08-0.20/GB

---

## 🚨 Troubleshooting

### Issue: Domain not verified
```bash
# Re-verify domain
gcloud domains verify uppowerskill.com
```

### Issue: SSL certificate pending
- Wait 15-30 minutes
- Check DNS propagation: https://dnschecker.org

### Issue: 404 errors
```bash
# Check service is running
gcloud run services list --region=asia-southeast1

# Check domain mapping
gcloud run domain-mappings describe uppowerskill.com \
  --region=asia-southeast1
```

---

## 📚 Next Steps

1. ✅ Verify domain ownership
2. ✅ Deploy to Cloud Run
3. ✅ Map custom domain
4. ✅ Configure DNS
5. ⏭️ Wait for SSL certificate
6. ⏭️ Test all endpoints
7. ⏭️ Update environment variables
8. ⏭️ Configure CDN (optional)

---

## 🔗 Useful Links

- **Google Cloud Console**: https://console.cloud.google.com/run?project=skillnexus-lms-2025
- **Domain Mappings**: https://console.cloud.google.com/run/domains?project=skillnexus-lms-2025
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.ssllabs.com/ssltest/

---

**Domain**: uppowerskill.com  
**Status**: Ready to configure  
**Next**: Deploy application and map domain
