# 🚀 Deploy uppowerskill.com to Google Cloud

## 📋 ข้อมูลที่มีอยู่แล้ว
- ✅ Email: joesive@gmail.com
- ✅ Domain: uppowerskill.com
- ✅ Vercel Project: the-skill-nexus
- ✅ Database: 34.124.203.250:5432

## 🎯 เป้าหมาย
Deploy จาก Vercel → Google Cloud Run (แนะนำ) หรือ App Engine

---

## 🚀 Option 1: Google Cloud Run (แนะนำ - ถูกกว่า)

### Step 1: Login Google Cloud
```bash
gcloud auth login joesive@gmail.com
gcloud config set project skillnexus-lms-2025
```

### Step 2: Build Docker Image
```bash
# Build
docker build -t gcr.io/skillnexus-lms-2025/uppowerskill:latest .

# Push to Google Container Registry
docker push gcr.io/skillnexus-lms-2025/uppowerskill:latest
```

### Step 3: Deploy to Cloud Run
```bash
gcloud run deploy uppowerskill \
  --image gcr.io/skillnexus-lms-2025/uppowerskill:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://skillnexus-user:SkillNexus2025!Secure@34.124.203.250:5432/skillnexus?sslmode=require" \
  --set-env-vars NEXTAUTH_URL="https://uppowerskill.com" \
  --set-env-vars NEXTAUTH_SECRET="rmQnCNXy9qxpobw61k3E2HWAcRezvfgt"
```

### Step 4: Map Custom Domain
```bash
gcloud run domain-mappings create \
  --service uppowerskill \
  --domain uppowerskill.com \
  --region asia-southeast1
```

---

## 🚀 Option 2: Google App Engine (ง่ายกว่า)

### Step 1: Login
```bash
gcloud auth login joesive@gmail.com
gcloud config set project skillnexus-lms-2025
```

### Step 2: Deploy
```bash
npm run build
gcloud app deploy
```

### Step 3: Map Domain
```bash
gcloud app domain-mappings create uppowerskill.com
```

---

## 🌐 ตั้งค่า DNS (uppowerskill.com)

### ไปที่ Domain Registrar (GoDaddy/Namecheap/etc.)

**สำหรับ Cloud Run:**
```
Type: CNAME
Name: @
Value: ghs.googlehosted.com

Type: CNAME  
Name: www
Value: ghs.googlehosted.com
```

**สำหรับ App Engine:**
```
Type: A
Name: @
Value: 216.239.32.21

Type: AAAA
Name: @
Value: 2001:4860:4802:32::15

Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

---

## 🔄 Migrate จาก Vercel

### 1. Export Environment Variables จาก Vercel
ไปที่: https://vercel.com/joesive47s-projects/the-skill-nexus/settings/environment-variables

Copy ทุกตัวแปรมาใส่ใน `app.yaml` หรือ Cloud Run

### 2. ลบ Vercel Deployment (Optional)
```bash
vercel remove the-skill-nexus
```

### 3. Update DNS
เปลี่ยน DNS จาก Vercel → Google Cloud

---

## 💰 เปรียบเทียบราคา

### Vercel (ปัจจุบัน)
- Hobby: $0/month (จำกัด)
- Pro: $20/month

### Google Cloud Run (แนะนำ)
- Free tier: 2M requests/month
- ประมาณ: $10-30/month

### Google App Engine
- Free tier: 28 hours/day
- ประมาณ: $50-150/month

---

## ⚡ Quick Deploy (Cloud Run)

```bash
# 1. Login
gcloud auth login joesive@gmail.com

# 2. Set project
gcloud config set project skillnexus-lms-2025

# 3. Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 4. Deploy
npm run build
gcloud run deploy uppowerskill \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

---

## 🔧 Environment Variables

ใช้ค่าเดียวกับที่ตั้งไว้ใน Vercel:
```bash
DATABASE_URL=postgresql://skillnexus-user:SkillNexus2025!Secure@34.124.203.250:5432/skillnexus?sslmode=require
NEXTAUTH_URL=https://uppowerskill.com
NEXTAUTH_SECRET=rmQnCNXy9qxpobw61k3E2HWAcRezvfgt
JWT_SECRET=jUng2EDA3aWX80GsJwkyCML1rQSVpPbN
```

---

## 📊 หลัง Deploy

### ตรวจสอบ
```bash
# Cloud Run
gcloud run services describe uppowerskill --region asia-southeast1

# App Engine
gcloud app describe
```

### ดู Logs
```bash
# Cloud Run
gcloud run logs read --service uppowerskill

# App Engine
gcloud app logs tail
```

### เปิดเว็บ
```bash
# Cloud Run
gcloud run services describe uppowerskill --format='value(status.url)'

# App Engine
gcloud app browse
```

---

## 🆘 ปัญหาที่อาจพบ

### Database Connection Error
ตรวจสอบ IP whitelist ที่ Cloud SQL:
```bash
gcloud sql instances patch skillnexus-db \
  --authorized-networks=0.0.0.0/0
```

### Domain Mapping Failed
รอ DNS propagate 24-48 ชั่วโมง

### Build Failed
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

**🎉 แนะนำ: ใช้ Cloud Run เพราะถูกกว่าและ scale ได้ดีกว่า!**
